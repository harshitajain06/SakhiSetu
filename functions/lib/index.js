"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.forumReportPost = exports.forumToggleBookmark = exports.forumToggleLike = exports.forumDeleteReply = exports.forumUpdateReply = exports.forumCreateReply = exports.forumDeletePost = exports.forumUpdatePost = exports.forumCreatePost = exports.forumGetOrCreateAnonName = exports.deliverScheduledTestPushes = exports.scheduleTestPushNotification = exports.vaccinationRemindersCustomTime = exports.vaccinationRemindersDaily = exports.generateVaccinationScheduleOnChildCreate = exports.periodTrackingRemindersDaily = void 0;
const admin = __importStar(require("firebase-admin"));
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
admin.initializeApp();
function dateOnlyUtc(d) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
function parseDateOnly(s) {
    // Accept "YYYY-MM-DD" or ISO; normalize to UTC date-only
    const d = new Date(s);
    if (!Number.isFinite(d.getTime()))
        return null;
    return dateOnlyUtc(d);
}
function diffDaysUtc(a, b) {
    const ms = dateOnlyUtc(a).getTime() - dateOnlyUtc(b).getTime();
    return Math.floor(ms / (24 * 60 * 60 * 1000));
}
/** YYYY-MM-DD from vaccine doc (matches app-stored strings). */
function parseDueYmd(vacc) {
    const raw = vacc.dueDate;
    if (raw == null)
        return null;
    const s = String(raw).trim();
    if (s.length >= 10)
        return s.slice(0, 10);
    return null;
}
function calendarDateStringInTz(d, timeZone) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(d);
}
/** Calendar days: today (in tz) minus due date. Same sign as diffDaysUtc(today, due). */
function diffCalendarDaysTodayMinusDue(todayYmd, dueYmd) {
    const [y1, m1, d1] = todayYmd.split('-').map(Number);
    const [y2, m2, d2] = dueYmd.split('-').map(Number);
    const t1 = Date.UTC(y1, m1 - 1, d1);
    const t2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round((t1 - t2) / (24 * 60 * 60 * 1000));
}
/** Wall-clock hour/minute in a specific IANA timezone (for reminder matching). */
function getClockInTimeZone(d, timeZone) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const parts = fmt.formatToParts(d);
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
    return { hour, minute };
}
/** True if current time in `timeZone` is within `windowMinutes` of reminder hour:minute. */
function isWithinReminderWindow(now, reminderHour, reminderMinute, timeZone, windowMinutes) {
    const { hour, minute } = getClockInTimeZone(now, timeZone);
    const nowTotal = hour * 60 + minute;
    const targetTotal = reminderHour * 60 + reminderMinute;
    const diff = Math.abs(nowTotal - targetTotal);
    return diff <= windowMinutes;
}
async function sendVaccinationRemindersForVaccine(params) {
    const { uid, name, child, v, vacc, now, calendarTimeZone } = params;
    const dueYmd = parseDueYmd(vacc);
    if (!dueYmd)
        return;
    const todayYmd = calendarDateStringInTz(now, calendarTimeZone);
    const delta = diffCalendarDaysTodayMinusDue(todayYmd, dueYmd);
    if (delta === -2 && !vacc.notification_2day_sent) {
        await sendToUserTokens({
            uid,
            title: 'Vaccination reminder',
            body: `${name}, your child’s vaccination (${vacc.vaccineName}) is due in 2 days. Please ensure timely vaccination for your child’s health.`,
            data: { type: 'vaccine_reminder', stage: 'minus2', childId: child.id, vaccineId: v.id }
        });
        await v.ref.set({ notification_2day_sent: true }, { merge: true });
    }
    else if (delta === 0 && !vacc.notification_due_sent) {
        await sendToUserTokens({
            uid,
            title: 'Vaccination due today',
            body: `${name}, your child’s vaccination (${vacc.vaccineName}) is due today. Please visit your nearest health center for vaccination.`,
            data: { type: 'vaccine_reminder', stage: 'due', childId: child.id, vaccineId: v.id }
        });
        await v.ref.set({ notification_due_sent: true }, { merge: true });
    }
    else if (delta === 7 && !vacc.notification_followup_sent) {
        await sendToUserTokens({
            uid,
            title: 'Vaccination follow-up',
            body: `${name}, was your child’s vaccination (${vacc.vaccineName}) completed? Please mark it as “Done” in SakhiSetu to update the record and stop reminders.`,
            data: { type: 'vaccine_reminder', stage: 'plus7', childId: child.id, vaccineId: v.id }
        });
        await v.ref.set({ notification_followup_sent: true }, { merge: true });
    }
}
async function sendToUserTokens(params) {
    const tokensSnap = await admin.firestore().collection('users').doc(params.uid).collection('fcmTokens').get();
    const tokens = tokensSnap.docs.map((d) => d.id).filter(Boolean);
    if (!tokens.length)
        return { success: 0, failure: 0 };
    const message = {
        tokens,
        notification: { title: params.title, body: params.body },
        data: params.data ?? {},
        android: {
            priority: 'high'
        }
    };
    const res = await admin.messaging().sendEachForMulticast(message);
    // Best-effort cleanup for invalid tokens.
    const invalidTokens = [];
    res.responses.forEach((r, idx) => {
        if (r.success)
            return;
        const code = r.error?.code;
        if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
            invalidTokens.push(tokens[idx]);
        }
    });
    await Promise.all(invalidTokens.map((t) => admin.firestore().collection('users').doc(params.uid).collection('fcmTokens').doc(t).delete().catch(() => { })));
    return { success: res.successCount, failure: res.failureCount };
}
exports.periodTrackingRemindersDaily = (0, scheduler_1.onSchedule)({ schedule: 'every day 09:00', timeZone: 'Asia/Kolkata' }, async () => {
    const today = new Date();
    const usersSnap = await admin.firestore().collection('users').get();
    const batch = admin.firestore().batch();
    for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        const user = userDoc.data();
        const prefs = user.notificationPrefs;
        const enabled = prefs?.enabled !== false && (prefs?.periodRemindersEnabled ?? true);
        if (!enabled)
            continue;
        const lastPeriod = user.menstrualData?.lastPeriod;
        if (!lastPeriod)
            continue;
        const lastPeriodDate = parseDateOnly(lastPeriod);
        if (!lastPeriodDate)
            continue;
        const daysSince = diffDaysUtc(today, lastPeriodDate);
        const name = user.name ?? 'Friend';
        const state = user.reminderState?.period ?? {};
        const lastSent31 = state.lastSent31;
        const lastSent60 = state.lastSent60;
        const lastSent90 = state.lastSent90;
        // Reset if lastPeriod changed (user recorded new period)
        if (state.lastPeriodStartDate && state.lastPeriodStartDate !== lastPeriod) {
            const ref = admin.firestore().collection('users').doc(uid);
            batch.set(ref, { reminderState: { period: { lastPeriodStartDate: lastPeriod } } }, { merge: true });
        }
        const shouldSend31 = daysSince >= 31 && !lastSent31;
        const shouldSend60 = daysSince >= 60 && !lastSent60;
        const shouldSend90 = daysSince >= 90 && !lastSent90;
        if (!shouldSend31 && !shouldSend60 && !shouldSend90)
            continue;
        if (shouldSend90) {
            await sendToUserTokens({
                uid,
                title: 'Period tracking reminder',
                body: `${name}, it has been over 90 days since your last recorded period. Please update your period record. If your period has not occurred, it is strongly recommended to consult a doctor.`,
                data: { type: 'period_reminder', stage: '90', screen: 'PeriodTracker' }
            });
            batch.set(admin.firestore().collection('users').doc(uid), {
                reminderState: { period: { lastSent90: today.toISOString(), lastPeriodStartDate: lastPeriod } }
            }, { merge: true });
        }
        else if (shouldSend60) {
            await sendToUserTokens({
                uid,
                title: 'Period tracking reminder',
                body: `${name}, it has been more than 60 days since your last recorded period. Please update your period in SakhiSetu to keep your cycle tracking accurate. If your period has not occurred, we recommend consulting a doctor.`,
                data: { type: 'period_reminder', stage: '60', screen: 'PeriodTracker' }
            });
            batch.set(admin.firestore().collection('users').doc(uid), {
                reminderState: { period: { lastSent60: today.toISOString(), lastPeriodStartDate: lastPeriod } }
            }, { merge: true });
        }
        else if (shouldSend31) {
            await sendToUserTokens({
                uid,
                title: 'Period tracking reminder',
                body: `${name}, it has been more than 30 days since you last recorded your period in SakhiSetu. Please update your period date so the app can accurately predict your next cycle.`,
                data: { type: 'period_reminder', stage: '31', screen: 'PeriodTracker' }
            });
            batch.set(admin.firestore().collection('users').doc(uid), {
                reminderState: { period: { lastSent31: today.toISOString(), lastPeriodStartDate: lastPeriod } }
            }, { merge: true });
        }
    }
    await batch.commit();
});
/** India UIP (MoHFW); verify with official updates and state-specific schedules. */
const VACCINE_TEMPLATES = [
    { vaccineName: 'BCG', recommendedAge: 'At Birth', daysFromDob: 0 },
    { vaccineName: 'OPV-0', recommendedAge: 'At Birth', daysFromDob: 0 },
    { vaccineName: 'Hepatitis B Birth Dose', recommendedAge: 'At Birth', daysFromDob: 0 },
    { vaccineName: 'Pentavalent-1', recommendedAge: '6 weeks', daysFromDob: 42 },
    { vaccineName: 'OPV-1', recommendedAge: '6 weeks', daysFromDob: 42 },
    { vaccineName: 'IPV-1', recommendedAge: '6 weeks', daysFromDob: 42 },
    { vaccineName: 'Rotavirus-1', recommendedAge: '6 weeks', daysFromDob: 42 },
    { vaccineName: 'PCV-1', recommendedAge: '6 weeks', daysFromDob: 42 },
    { vaccineName: 'Pentavalent-2', recommendedAge: '10 weeks', daysFromDob: 70 },
    { vaccineName: 'OPV-2', recommendedAge: '10 weeks', daysFromDob: 70 },
    { vaccineName: 'IPV-2', recommendedAge: '10 weeks', daysFromDob: 70 },
    { vaccineName: 'Rotavirus-2', recommendedAge: '10 weeks', daysFromDob: 70 },
    { vaccineName: 'PCV-2', recommendedAge: '10 weeks', daysFromDob: 70 },
    { vaccineName: 'Pentavalent-3', recommendedAge: '14 weeks', daysFromDob: 98 },
    { vaccineName: 'OPV-3', recommendedAge: '14 weeks', daysFromDob: 98 },
    { vaccineName: 'IPV-3', recommendedAge: '14 weeks', daysFromDob: 98 },
    { vaccineName: 'Rotavirus-3', recommendedAge: '14 weeks', daysFromDob: 98 },
    { vaccineName: 'PCV-3', recommendedAge: '14 weeks', daysFromDob: 98 },
    { vaccineName: 'Measles-1 / MR-1', recommendedAge: '9 months', daysFromDob: 270 },
    { vaccineName: 'DPT Booster-1', recommendedAge: '16–18 months', daysFromDob: 486 },
    { vaccineName: 'OPV Booster (16–18 m)', recommendedAge: '16–18 months', daysFromDob: 486 },
    { vaccineName: 'IPV Booster', recommendedAge: '16–18 months', daysFromDob: 486 },
    { vaccineName: 'MMR', recommendedAge: '18 months', daysFromDob: 548 },
    { vaccineName: 'DT (5 years)', recommendedAge: '5 years', daysFromDob: 1825 },
    { vaccineName: 'OPV Booster (5 years)', recommendedAge: '5 years', daysFromDob: 1825 }
];
function vaccineDocId(tmpl) {
    const slug = tmpl.vaccineName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'v';
    return `d${tmpl.daysFromDob}_${slug}`;
}
exports.generateVaccinationScheduleOnChildCreate = (0, firestore_1.onDocumentCreated)('users/{uid}/children/{childId}', async (event) => {
    const uid = event.params.uid;
    const childId = event.params.childId;
    const data = event.data?.data();
    if (!data?.dob || !data.childName)
        return;
    const dob = parseDateOnly(data.dob);
    if (!dob)
        return;
    const batch = admin.firestore().batch();
    const vaccinesCol = admin.firestore().collection('users').doc(uid).collection('children').doc(childId).collection('vaccinations');
    for (const tmpl of VACCINE_TEMPLATES) {
        const due = new Date(dob);
        due.setUTCDate(due.getUTCDate() + tmpl.daysFromDob);
        const dueDate = due.toISOString().slice(0, 10);
        const vaccineRef = vaccinesCol.doc(vaccineDocId(tmpl));
        batch.set(vaccineRef, {
            vaccineName: tmpl.vaccineName,
            recommendedAge: tmpl.recommendedAge,
            dueDate,
            status: 'pending',
            completionDate: null,
            notification_2day_sent: false,
            notification_due_sent: false,
            notification_followup_sent: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    await batch.commit();
});
exports.vaccinationRemindersDaily = (0, scheduler_1.onSchedule)({ schedule: 'every day 09:00', timeZone: 'Asia/Kolkata' }, async () => {
    const now = new Date();
    const calendarTimeZone = 'Asia/Kolkata';
    const usersSnap = await admin.firestore().collection('users').get();
    for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        const user = userDoc.data();
        const prefs = user.notificationPrefs;
        const enabled = prefs?.enabled !== false && (prefs?.vaccinationRemindersEnabled ?? true);
        if (!enabled)
            continue;
        const name = user.name ?? 'Friend';
        const childrenSnap = await admin.firestore().collection('users').doc(uid).collection('children').get();
        for (const child of childrenSnap.docs) {
            const vaccSnap = await child.ref.collection('vaccinations').where('status', '==', 'pending').get();
            for (const v of vaccSnap.docs) {
                const vacc = v.data();
                if (vacc.isCustom)
                    continue;
                await sendVaccinationRemindersForVaccine({
                    uid,
                    name,
                    child,
                    v,
                    vacc,
                    now,
                    calendarTimeZone
                });
            }
        }
    }
});
/** Custom vaccines: same date rules, but only send around user-selected local time (every 5 min check). */
exports.vaccinationRemindersCustomTime = (0, scheduler_1.onSchedule)({ schedule: '*/5 * * * *', timeZone: 'Asia/Kolkata' }, async () => {
    const now = new Date();
    const usersSnap = await admin.firestore().collection('users').get();
    for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        const user = userDoc.data();
        const prefs = user.notificationPrefs;
        const enabled = prefs?.enabled !== false && (prefs?.vaccinationRemindersEnabled ?? true);
        if (!enabled)
            continue;
        const name = user.name ?? 'Friend';
        const childrenSnap = await admin.firestore().collection('users').doc(uid).collection('children').get();
        for (const child of childrenSnap.docs) {
            const vaccSnap = await child.ref.collection('vaccinations').where('status', '==', 'pending').get();
            for (const v of vaccSnap.docs) {
                const vacc = v.data();
                if (!vacc.isCustom)
                    continue;
                const rh = typeof vacc.reminderHour === 'number' ? vacc.reminderHour : 9;
                const rm = typeof vacc.reminderMinute === 'number' ? vacc.reminderMinute : 0;
                const tz = typeof vacc.reminderTimezone === 'string' ? vacc.reminderTimezone : 'Asia/Kolkata';
                if (!isWithinReminderWindow(now, rh, rm, tz, 10))
                    continue;
                await sendVaccinationRemindersForVaccine({
                    uid,
                    name,
                    child,
                    v,
                    vacc,
                    now,
                    calendarTimeZone: tz
                });
            }
        }
    }
});
const TEST_PUSH_DELAY_MS = 5 * 60 * 1000;
/** Enqueues a real FCM test ~5 minutes later so the device can receive it in the background. */
exports.scheduleTestPushNotification = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const tokensSnap = await admin.firestore().collection('users').doc(uid).collection('fcmTokens').get();
    if (tokensSnap.empty) {
        throw new https_1.HttpsError('failed-precondition', 'No FCM device token saved for this account yet.');
    }
    const scheduledFor = admin.firestore.Timestamp.fromMillis(Date.now() + TEST_PUSH_DELAY_MS);
    await admin.firestore().collection('users').doc(uid).collection('scheduledTestPushes').add({
        scheduledFor,
        sent: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return {
        ok: true,
        delayMinutes: 5,
        scheduledFor: scheduledFor.toMillis()
    };
});
/** Sends due scheduled test pushes (real FCM, not in-app). Runs every minute. */
exports.deliverScheduledTestPushes = (0, scheduler_1.onSchedule)({ schedule: 'every 1 minutes', timeZone: 'UTC' }, async () => {
    const now = admin.firestore.Timestamp.now();
    const q = await admin
        .firestore()
        .collectionGroup('scheduledTestPushes')
        .where('sent', '==', false)
        .where('scheduledFor', '<=', now)
        .limit(50)
        .get();
    for (const docSnap of q.docs) {
        const ref = docSnap.ref;
        const uid = ref.parent.parent?.id;
        if (!uid)
            continue;
        const claimed = await admin.firestore().runTransaction(async (tx) => {
            const fresh = await tx.get(ref);
            const d = fresh.data();
            if (!d || d.sent === true)
                return false;
            tx.update(ref, {
                sent: true,
                deliveredAt: admin.firestore.FieldValue.serverTimestamp()
            });
            return true;
        });
        if (!claimed)
            continue;
        const userSnap = await admin.firestore().collection('users').doc(uid).get();
        const name = userSnap.data()?.name ?? 'Friend';
        await sendToUserTokens({
            uid,
            title: 'SakhiSetu test',
            body: `${name}, this is your delayed test push. If you see this, FCM delivery is working.`,
            data: { type: 'test_scheduled' }
        });
    }
});
function randomAnonName(uid) {
    // Stable-ish suffix while still not exposing uid directly.
    let h = 0;
    for (let i = 0; i < uid.length; i++)
        h = (h * 31 + uid.charCodeAt(i)) >>> 0;
    const suffix = String(1000 + (h % 9000));
    return `User_${suffix}`;
}
async function getOrCreateAnonName(uid) {
    const ref = admin.firestore().collection('users').doc(uid);
    const snap = await ref.get();
    const existing = snap.data()?.anonymousName;
    if (existing && typeof existing === 'string')
        return existing;
    const anon = randomAnonName(uid);
    await ref.set({ anonymousName: anon }, { merge: true });
    return anon;
}
async function getOpenAiKeyFromFirestore() {
    // Mirror the app-side config usage, but keep the key server-only in practice.
    const ref = admin.firestore().collection('appConfigKratika').doc('openai');
    const snap = await ref.get();
    const key = snap.data()?.apiKey;
    return typeof key === 'string' && key.trim() ? key.trim() : null;
}
async function moderateTextAndImage(params) {
    const apiKey = await getOpenAiKeyFromFirestore();
    if (!apiKey) {
        // Fail closed: forum requires moderation.
        return { allowed: false, flagged: true, reasons: ['missing_moderation_key'] };
    }
    const input = [{ type: 'text', text: params.text ?? '' }];
    if (params.imageUrl)
        input.push({ type: 'image_url', image_url: { url: params.imageUrl } });
    const resp = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'omni-moderation-latest',
            input,
        }),
    });
    if (!resp.ok) {
        return { allowed: false, flagged: true, reasons: [`moderation_http_${resp.status}`] };
    }
    const data = (await resp.json());
    const result = data?.results?.[0];
    const flagged = Boolean(result?.flagged);
    return { allowed: !flagged, flagged, reasons: flagged ? ['flagged'] : [] };
}
const FORUM_CHANNELS = new Set(['menstrual', 'maternal']);
exports.forumGetOrCreateAnonName = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const anonymousName = await getOrCreateAnonName(uid);
    return { ok: true, anonymousName };
});
exports.forumCreatePost = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const channel = String(request.data?.channel ?? '').trim();
    const title = request.data?.title != null ? String(request.data.title).trim() : null;
    const contentText = String(request.data?.contentText ?? '').trim();
    const imageUrl = request.data?.imageUrl != null ? String(request.data.imageUrl).trim() : null;
    if (!FORUM_CHANNELS.has(channel))
        throw new https_1.HttpsError('invalid-argument', 'Invalid channel');
    if (!contentText)
        throw new https_1.HttpsError('invalid-argument', 'Post text is required');
    if (contentText.length > 2000)
        throw new https_1.HttpsError('invalid-argument', 'Post too long');
    const anon = await getOrCreateAnonName(uid);
    const mod = await moderateTextAndImage({ text: [title, contentText].filter(Boolean).join('\n\n'), imageUrl });
    if (!mod.allowed) {
        throw new https_1.HttpsError('failed-precondition', 'This post violates community guidelines and cannot be published.');
    }
    const ref = admin.firestore().collection('forumPosts').doc();
    await ref.set({
        userId: uid,
        authorDisplayName: anon,
        channel,
        title: title || null,
        contentText,
        contentImageUrl: imageUrl || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'active',
        likeCount: 0,
        replyCount: 0,
        reportCount: 0,
    });
    return { ok: true, postId: ref.id };
});
exports.forumUpdatePost = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    const channel = request.data?.channel != null ? String(request.data.channel).trim() : null;
    const title = request.data?.title != null ? String(request.data.title).trim() : null;
    const contentText = String(request.data?.contentText ?? '').trim();
    const imageUrl = request.data?.imageUrl != null ? String(request.data.imageUrl).trim() : null;
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    if (!contentText)
        throw new https_1.HttpsError('invalid-argument', 'Post text is required');
    if (contentText.length > 2000)
        throw new https_1.HttpsError('invalid-argument', 'Post too long');
    if (channel != null && !FORUM_CHANNELS.has(channel))
        throw new https_1.HttpsError('invalid-argument', 'Invalid channel');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists)
        throw new https_1.HttpsError('not-found', 'Post not found');
    const post = postSnap.data();
    if (post?.status === 'removed')
        throw new https_1.HttpsError('failed-precondition', 'Post is not active');
    if (post?.userId !== uid)
        throw new https_1.HttpsError('permission-denied', 'Only the author can edit this post');
    const mod = await moderateTextAndImage({ text: [title, contentText].filter(Boolean).join('\n\n'), imageUrl });
    if (!mod.allowed) {
        throw new https_1.HttpsError('failed-precondition', 'This post violates community guidelines and cannot be published.');
    }
    await postRef.set({
        ...(channel != null ? { channel } : {}),
        title: title || null,
        contentText,
        contentImageUrl: imageUrl || null,
        editedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return { ok: true, postId };
});
exports.forumDeletePost = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    await admin.firestore().runTransaction(async (tx) => {
        const postSnap = await tx.get(postRef);
        if (!postSnap.exists)
            throw new https_1.HttpsError('not-found', 'Post not found');
        const post = postSnap.data();
        if (post?.status === 'removed')
            return; // idempotent
        if (post?.userId !== uid)
            throw new https_1.HttpsError('permission-denied', 'Only the author can delete this post');
        tx.update(postRef, {
            status: 'removed',
            removedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    });
    return { ok: true, removed: true };
});
exports.forumCreateReply = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    const replyText = String(request.data?.replyText ?? '').trim();
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    if (!replyText)
        throw new https_1.HttpsError('invalid-argument', 'Reply text required');
    if (replyText.length > 2000)
        throw new https_1.HttpsError('invalid-argument', 'Reply too long');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists)
        throw new https_1.HttpsError('not-found', 'Post not found');
    if (postSnap.data()?.status === 'removed')
        throw new https_1.HttpsError('failed-precondition', 'Post is not active');
    const anon = await getOrCreateAnonName(uid);
    const mod = await moderateTextAndImage({ text: replyText });
    if (!mod.allowed)
        throw new https_1.HttpsError('failed-precondition', 'This reply violates community guidelines and cannot be published.');
    const replyRef = postRef.collection('replies').doc();
    await admin.firestore().runTransaction(async (tx) => {
        tx.set(replyRef, {
            userId: uid,
            authorDisplayName: anon,
            replyText,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active',
        });
        tx.update(postRef, {
            replyCount: admin.firestore.FieldValue.increment(1),
        });
    });
    return { ok: true, replyId: replyRef.id };
});
exports.forumUpdateReply = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    const replyId = String(request.data?.replyId ?? '').trim();
    const replyText = String(request.data?.replyText ?? '').trim();
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    if (!replyId)
        throw new https_1.HttpsError('invalid-argument', 'replyId required');
    if (!replyText)
        throw new https_1.HttpsError('invalid-argument', 'Reply text required');
    if (replyText.length > 2000)
        throw new https_1.HttpsError('invalid-argument', 'Reply too long');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    const replyRef = postRef.collection('replies').doc(replyId);
    const mod = await moderateTextAndImage({ text: replyText });
    if (!mod.allowed)
        throw new https_1.HttpsError('failed-precondition', 'This reply violates community guidelines and cannot be published.');
    await admin.firestore().runTransaction(async (tx) => {
        const [postSnap, replySnap] = await Promise.all([tx.get(postRef), tx.get(replyRef)]);
        if (!postSnap.exists)
            throw new https_1.HttpsError('not-found', 'Post not found');
        if (postSnap.data()?.status === 'removed')
            throw new https_1.HttpsError('failed-precondition', 'Post is not active');
        if (!replySnap.exists)
            throw new https_1.HttpsError('not-found', 'Reply not found');
        const reply = replySnap.data();
        if (reply?.status === 'removed')
            throw new https_1.HttpsError('failed-precondition', 'Reply is not active');
        if (reply?.userId !== uid)
            throw new https_1.HttpsError('permission-denied', 'Only the author can edit this reply');
        tx.set(replyRef, {
            replyText,
            editedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    });
    return { ok: true, postId, replyId };
});
exports.forumDeleteReply = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    const replyId = String(request.data?.replyId ?? '').trim();
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    if (!replyId)
        throw new https_1.HttpsError('invalid-argument', 'replyId required');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    const replyRef = postRef.collection('replies').doc(replyId);
    await admin.firestore().runTransaction(async (tx) => {
        const [postSnap, replySnap] = await Promise.all([tx.get(postRef), tx.get(replyRef)]);
        if (!postSnap.exists)
            throw new https_1.HttpsError('not-found', 'Post not found');
        if (!replySnap.exists)
            throw new https_1.HttpsError('not-found', 'Reply not found');
        const reply = replySnap.data();
        if (reply?.userId !== uid)
            throw new https_1.HttpsError('permission-denied', 'Only the author can delete this reply');
        if (reply?.status === 'removed')
            return; // idempotent
        tx.update(replyRef, {
            status: 'removed',
            removedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Keep replyCount consistent for UI lists (best-effort).
        tx.update(postRef, {
            replyCount: admin.firestore.FieldValue.increment(-1),
        });
    });
    return { ok: true, removed: true, postId, replyId };
});
exports.forumToggleLike = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    const likeRef = postRef.collection('likes').doc(uid);
    const res = await admin.firestore().runTransaction(async (tx) => {
        const [postSnap, likeSnap] = await Promise.all([tx.get(postRef), tx.get(likeRef)]);
        if (!postSnap.exists)
            throw new https_1.HttpsError('not-found', 'Post not found');
        if (postSnap.data()?.status === 'removed')
            throw new https_1.HttpsError('failed-precondition', 'Post is not active');
        const liked = likeSnap.exists;
        if (liked) {
            tx.delete(likeRef);
            tx.update(postRef, { likeCount: admin.firestore.FieldValue.increment(-1) });
            return { liked: false };
        }
        else {
            tx.set(likeRef, { createdAt: admin.firestore.FieldValue.serverTimestamp() });
            tx.update(postRef, { likeCount: admin.firestore.FieldValue.increment(1) });
            return { liked: true };
        }
    });
    return { ok: true, ...res };
});
exports.forumToggleBookmark = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    const bmRef = admin.firestore().collection('users').doc(uid).collection('forumBookmarks').doc(postId);
    const res = await admin.firestore().runTransaction(async (tx) => {
        const [postSnap, bmSnap] = await Promise.all([tx.get(postRef), tx.get(bmRef)]);
        if (!postSnap.exists)
            throw new https_1.HttpsError('not-found', 'Post not found');
        if (postSnap.data()?.status === 'removed')
            throw new https_1.HttpsError('failed-precondition', 'Post is not active');
        const saved = bmSnap.exists;
        if (saved) {
            tx.delete(bmRef);
            return { saved: false };
        }
        else {
            tx.set(bmRef, { postId, createdAt: admin.firestore.FieldValue.serverTimestamp() });
            return { saved: true };
        }
    });
    return { ok: true, ...res };
});
exports.forumReportPost = (0, https_1.onCall)({ region: 'us-central1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    const uid = request.auth.uid;
    const postId = String(request.data?.postId ?? '').trim();
    const replyId = String(request.data?.replyId ?? '').trim();
    const reason = String(request.data?.reason ?? 'user_report').slice(0, 120);
    if (!postId)
        throw new https_1.HttpsError('invalid-argument', 'postId required');
    const postRef = admin.firestore().collection('forumPosts').doc(postId);
    // Report a reply (same callable as post so one deploy updates both paths).
    if (replyId) {
        const replyRef = postRef.collection('replies').doc(replyId);
        const repRef = replyRef.collection('reports').doc(uid);
        await admin.firestore().runTransaction(async (tx) => {
            const [postSnap, replySnap, repSnap] = await Promise.all([
                tx.get(postRef),
                tx.get(replyRef),
                tx.get(repRef),
            ]);
            if (!postSnap.exists)
                throw new https_1.HttpsError('not-found', 'Post not found');
            if (postSnap.data()?.status === 'removed') {
                throw new https_1.HttpsError('failed-precondition', 'Post is not active');
            }
            if (!replySnap.exists)
                throw new https_1.HttpsError('not-found', 'Reply not found');
            const reply = replySnap.data();
            if (reply?.status === 'removed')
                throw new https_1.HttpsError('failed-precondition', 'Reply is not active');
            if (reply?.userId === uid)
                throw new https_1.HttpsError('failed-precondition', 'Cannot report your own reply');
            if (repSnap.exists)
                return; // idempotent
            const nextCount = (typeof reply?.reportCount === 'number' ? reply.reportCount : 0) + 1;
            const shouldFlag = nextCount >= 3;
            tx.set(repRef, { uid, reason, createdAt: admin.firestore.FieldValue.serverTimestamp() });
            tx.update(replyRef, {
                reportCount: admin.firestore.FieldValue.increment(1),
                ...(shouldFlag ? { status: 'flagged' } : {}),
            });
        });
        return { ok: true, reported: true };
    }
    const repRef = postRef.collection('reports').doc(uid);
    await admin.firestore().runTransaction(async (tx) => {
        const [postSnap, repSnap] = await Promise.all([tx.get(postRef), tx.get(repRef)]);
        if (!postSnap.exists)
            throw new https_1.HttpsError('not-found', 'Post not found');
        if (repSnap.exists)
            return; // idempotent
        const post = postSnap.data();
        const nextCount = (typeof post?.reportCount === 'number' ? post.reportCount : 0) + 1;
        const shouldFlag = nextCount >= 3;
        tx.set(repRef, { uid, reason, createdAt: admin.firestore.FieldValue.serverTimestamp() });
        tx.update(postRef, {
            reportCount: admin.firestore.FieldValue.increment(1),
            ...(shouldFlag ? { status: 'flagged' } : {}),
        });
    });
    return { ok: true, reported: true };
});

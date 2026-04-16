import * as admin from 'firebase-admin';
import type { DocumentReference } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

admin.initializeApp();

type UserDoc = {
  name?: string;
  notificationPrefs?: {
    enabled?: boolean;
    periodRemindersEnabled?: boolean;
    vaccinationRemindersEnabled?: boolean;
  };
  menstrualData?: {
    lastPeriod?: string | null; // yyyy-mm-dd or ISO string used by app
  };
  reminderState?: {
    period?: {
      lastSent31?: string;
      lastSent60?: string;
      lastSent90?: string;
      lastPeriodStartDate?: string;
    };
  };
};

function dateOnlyUtc(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseDateOnly(s: string) {
  // Accept "YYYY-MM-DD" or ISO; normalize to UTC date-only
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return null;
  return dateOnlyUtc(d);
}

function diffDaysUtc(a: Date, b: Date) {
  const ms = dateOnlyUtc(a).getTime() - dateOnlyUtc(b).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

/** YYYY-MM-DD from vaccine doc (matches app-stored strings). */
function parseDueYmd(vacc: Record<string, unknown>): string | null {
  const raw = vacc.dueDate;
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s.length >= 10) return s.slice(0, 10);
  return null;
}

function calendarDateStringInTz(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
}

/** Calendar days: today (in tz) minus due date. Same sign as diffDaysUtc(today, due). */
function diffCalendarDaysTodayMinusDue(todayYmd: string, dueYmd: string): number {
  const [y1, m1, d1] = todayYmd.split('-').map(Number);
  const [y2, m2, d2] = dueYmd.split('-').map(Number);
  const t1 = Date.UTC(y1, m1 - 1, d1);
  const t2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((t1 - t2) / (24 * 60 * 60 * 1000));
}

/** Wall-clock hour/minute in a specific IANA timezone (for reminder matching). */
function getClockInTimeZone(d: Date, timeZone: string): { hour: number; minute: number } {
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
function isWithinReminderWindow(
  now: Date,
  reminderHour: number,
  reminderMinute: number,
  timeZone: string,
  windowMinutes: number
): boolean {
  const { hour, minute } = getClockInTimeZone(now, timeZone);
  const nowTotal = hour * 60 + minute;
  const targetTotal = reminderHour * 60 + reminderMinute;
  const diff = Math.abs(nowTotal - targetTotal);
  return diff <= windowMinutes;
}

async function sendVaccinationRemindersForVaccine(params: {
  uid: string;
  name: string;
  child: { id: string };
  v: { id: string; ref: DocumentReference };
  vacc: Record<string, unknown>;
  now: Date;
  /** IANA zone for "today" when comparing to dueDate (YYYY-MM-DD). */
  calendarTimeZone: string;
}): Promise<void> {
  const { uid, name, child, v, vacc, now, calendarTimeZone } = params;
  const dueYmd = parseDueYmd(vacc);
  if (!dueYmd) return;

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
  } else if (delta === 0 && !vacc.notification_due_sent) {
    await sendToUserTokens({
      uid,
      title: 'Vaccination due today',
      body: `${name}, your child’s vaccination (${vacc.vaccineName}) is due today. Please visit your nearest health center for vaccination.`,
      data: { type: 'vaccine_reminder', stage: 'due', childId: child.id, vaccineId: v.id }
    });
    await v.ref.set({ notification_due_sent: true }, { merge: true });
  } else if (delta === 7 && !vacc.notification_followup_sent) {
    await sendToUserTokens({
      uid,
      title: 'Vaccination follow-up',
      body: `${name}, was your child’s vaccination (${vacc.vaccineName}) completed? Please mark it as “Done” in SakhiSetu to update the record and stop reminders.`,
      data: { type: 'vaccine_reminder', stage: 'plus7', childId: child.id, vaccineId: v.id }
    });
    await v.ref.set({ notification_followup_sent: true }, { merge: true });
  }
}

async function sendToUserTokens(params: {
  uid: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const tokensSnap = await admin.firestore().collection('users').doc(params.uid).collection('fcmTokens').get();
  const tokens = tokensSnap.docs.map((d) => d.id).filter(Boolean);
  if (!tokens.length) return { success: 0, failure: 0 };

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title: params.title, body: params.body },
    data: params.data ?? {},
    android: {
      priority: 'high'
    }
  };

  const res = await admin.messaging().sendEachForMulticast(message);

  // Best-effort cleanup for invalid tokens.
  const invalidTokens: string[] = [];
  res.responses.forEach((r, idx) => {
    if (r.success) return;
    const code = (r.error as any)?.code as string | undefined;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
      invalidTokens.push(tokens[idx]!);
    }
  });

  await Promise.all(
    invalidTokens.map((t) =>
      admin.firestore().collection('users').doc(params.uid).collection('fcmTokens').doc(t).delete().catch(() => {})
    )
  );

  return { success: res.successCount, failure: res.failureCount };
}

export const periodTrackingRemindersDaily = onSchedule(
  { schedule: 'every day 09:00', timeZone: 'Asia/Kolkata' },
  async () => {
    const today = new Date();
    const usersSnap = await admin.firestore().collection('users').get();

    const batch = admin.firestore().batch();

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const user = userDoc.data() as UserDoc;

      const prefs = user.notificationPrefs;
      const enabled =
        prefs?.enabled !== false && (prefs?.periodRemindersEnabled ?? true);
      if (!enabled) continue;

      const lastPeriod = user.menstrualData?.lastPeriod;
      if (!lastPeriod) continue;

      const lastPeriodDate = parseDateOnly(lastPeriod);
      if (!lastPeriodDate) continue;

      const daysSince = diffDaysUtc(today, lastPeriodDate);
      const name = user.name ?? 'Friend';

      const state = user.reminderState?.period ?? {};
      const lastSent31 = state.lastSent31;
      const lastSent60 = state.lastSent60;
      const lastSent90 = state.lastSent90;

      // Reset if lastPeriod changed (user recorded new period)
      if (state.lastPeriodStartDate && state.lastPeriodStartDate !== lastPeriod) {
        const ref = admin.firestore().collection('users').doc(uid);
        batch.set(
          ref,
          { reminderState: { period: { lastPeriodStartDate: lastPeriod } } },
          { merge: true }
        );
      }

      const shouldSend31 = daysSince >= 31 && !lastSent31;
      const shouldSend60 = daysSince >= 60 && !lastSent60;
      const shouldSend90 = daysSince >= 90 && !lastSent90;

      if (!shouldSend31 && !shouldSend60 && !shouldSend90) continue;

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
      } else if (shouldSend60) {
        await sendToUserTokens({
          uid,
          title: 'Period tracking reminder',
          body: `${name}, it has been more than 60 days since your last recorded period. Please update your period in SakhiSetu to keep your cycle tracking accurate. If your period has not occurred, we recommend consulting a doctor.`,
          data: { type: 'period_reminder', stage: '60', screen: 'PeriodTracker' }
        });
        batch.set(admin.firestore().collection('users').doc(uid), {
          reminderState: { period: { lastSent60: today.toISOString(), lastPeriodStartDate: lastPeriod } }
        }, { merge: true });
      } else if (shouldSend31) {
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
  }
);

type ChildDoc = {
  childName: string;
  dob: string; // YYYY-MM-DD preferred
};

type VaccineTemplate = {
  vaccineName: string;
  recommendedAge: string;
  daysFromDob: number;
};

/** India UIP (MoHFW); verify with official updates and state-specific schedules. */
const VACCINE_TEMPLATES: VaccineTemplate[] = [
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

function vaccineDocId(tmpl: VaccineTemplate) {
  const slug = tmpl.vaccineName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'v';
  return `d${tmpl.daysFromDob}_${slug}`;
}

export const generateVaccinationScheduleOnChildCreate = onDocumentCreated(
  'users/{uid}/children/{childId}',
  async (event) => {
    const uid = event.params.uid as string;
    const childId = event.params.childId as string;
    const data = event.data?.data() as ChildDoc | undefined;
    if (!data?.dob || !data.childName) return;

    const dob = parseDateOnly(data.dob);
    if (!dob) return;

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
  }
);

export const vaccinationRemindersDaily = onSchedule(
  { schedule: 'every day 09:00', timeZone: 'Asia/Kolkata' },
  async () => {
    const now = new Date();
    const calendarTimeZone = 'Asia/Kolkata';
    const usersSnap = await admin.firestore().collection('users').get();

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const user = userDoc.data() as UserDoc;
      const prefs = user.notificationPrefs;
      const enabled =
        prefs?.enabled !== false && (prefs?.vaccinationRemindersEnabled ?? true);
      if (!enabled) continue;

      const name = user.name ?? 'Friend';

      const childrenSnap = await admin.firestore().collection('users').doc(uid).collection('children').get();
      for (const child of childrenSnap.docs) {
        const vaccSnap = await child.ref.collection('vaccinations').where('status', '==', 'pending').get();

        for (const v of vaccSnap.docs) {
          const vacc = v.data() as any;
          if (vacc.isCustom) continue;

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
  }
);

/** Custom vaccines: same date rules, but only send around user-selected local time (every 5 min check). */
export const vaccinationRemindersCustomTime = onSchedule(
  { schedule: '*/5 * * * *', timeZone: 'Asia/Kolkata' },
  async () => {
    const now = new Date();
    const usersSnap = await admin.firestore().collection('users').get();

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const user = userDoc.data() as UserDoc;
      const prefs = user.notificationPrefs;
      const enabled =
        prefs?.enabled !== false && (prefs?.vaccinationRemindersEnabled ?? true);
      if (!enabled) continue;

      const name = user.name ?? 'Friend';

      const childrenSnap = await admin.firestore().collection('users').doc(uid).collection('children').get();
      for (const child of childrenSnap.docs) {
        const vaccSnap = await child.ref.collection('vaccinations').where('status', '==', 'pending').get();

        for (const v of vaccSnap.docs) {
          const vacc = v.data() as any;
          if (!vacc.isCustom) continue;

          const rh = typeof vacc.reminderHour === 'number' ? vacc.reminderHour : 9;
          const rm = typeof vacc.reminderMinute === 'number' ? vacc.reminderMinute : 0;
          const tz = typeof vacc.reminderTimezone === 'string' ? vacc.reminderTimezone : 'Asia/Kolkata';

          if (!isWithinReminderWindow(now, rh, rm, tz, 10)) continue;

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
  }
);

const TEST_PUSH_DELAY_MS = 5 * 60 * 1000;

/** Enqueues a real FCM test ~5 minutes later so the device can receive it in the background. */
export const scheduleTestPushNotification = onCall({ region: 'us-central1' }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required');
  const uid = request.auth.uid;

  const tokensSnap = await admin.firestore().collection('users').doc(uid).collection('fcmTokens').get();
  if (tokensSnap.empty) {
    throw new HttpsError('failed-precondition', 'No FCM device token saved for this account yet.');
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
export const deliverScheduledTestPushes = onSchedule(
  { schedule: 'every 1 minutes', timeZone: 'UTC' },
  async () => {
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
      if (!uid) continue;

      const claimed = await admin.firestore().runTransaction(async (tx) => {
        const fresh = await tx.get(ref);
        const d = fresh.data();
        if (!d || d.sent === true) return false;
        tx.update(ref, {
          sent: true,
          deliveredAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return true;
      });

      if (!claimed) continue;

      const userSnap = await admin.firestore().collection('users').doc(uid).get();
      const name = (userSnap.data() as UserDoc | undefined)?.name ?? 'Friend';

      await sendToUserTokens({
        uid,
        title: 'SakhiSetu test',
        body: `${name}, this is your delayed test push. If you see this, FCM delivery is working.`,
        data: { type: 'test_scheduled' }
      });
    }
  }
);


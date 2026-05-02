import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db, functions } from '../config/firebase';
import { useTranslation } from '../contexts/TranslationContext';
import { syncFcmTokenToFirestore } from './utils/fcm';
import {
  dueDateStringFromDob,
  vaccineDocId,
  vaccineStatusCategory,
  VACCINE_TEMPLATES,
} from './utils/vaccinationSchedule';

const MOHFW_SCHEDULE_PDF =
  'https://www.mohfw.gov.in/sites/default/files/245453521061489663873.pdf';

export default function ChildVaccinationTrackerScreen({ embedded = false }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [childName, setChildName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customChildId, setCustomChildId] = useState(null);
  const [customVaccineName, setCustomVaccineName] = useState('');
  const [customRecommendedAge, setCustomRecommendedAge] = useState('');
  const [customDueDate, setCustomDueDate] = useState(() => new Date());
  const [showCustomDuePicker, setShowCustomDuePicker] = useState(false);
  const [customReminderTime, setCustomReminderTime] = useState(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);
  const [testPushBusy, setTestPushBusy] = useState(false);
  const [uid, setUid] = useState(() => auth.currentUser?.uid ?? null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return unsub;
  }, []);

  const formatDob = (d) => d.toISOString().slice(0, 10);

  /** Local calendar YYYY-MM-DD (avoid UTC shift from toISOString for due dates). */
  const formatLocalYmd = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const seedVaccinationsForChild = async (childId, dobStr) => {
    if (!uid) return;
    const batch = writeBatch(db);
    const vaccinesCol = collection(db, 'users', uid, 'children', childId, 'vaccinations');
    for (const tmpl of VACCINE_TEMPLATES) {
      const dueDate = dueDateStringFromDob(dobStr, tmpl.daysFromDob);
      const vref = doc(vaccinesCol, vaccineDocId(tmpl));
      batch.set(
        vref,
        {
          vaccineName: tmpl.vaccineName,
          recommendedAge: tmpl.recommendedAge,
          dueDate,
          status: 'pending',
          completionDate: null,
          notification_2day_sent: false,
          notification_due_sent: false,
          notification_followup_sent: false,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    await batch.commit();
  };

  /** Adds any new UIP doses missing from older app versions (idempotent). */
  const ensureMissingStandardVaccines = async (childId, dobStr) => {
    if (!uid || !dobStr) return false;
    const dobY = String(dobStr).slice(0, 10);
    const vaccinesCol = collection(db, 'users', uid, 'children', childId, 'vaccinations');
    const existing = await getDocs(vaccinesCol);
    const existingIds = new Set(existing.docs.map((d) => d.id));
    const batch = writeBatch(db);
    let added = 0;
    for (const tmpl of VACCINE_TEMPLATES) {
      const id = vaccineDocId(tmpl);
      if (existingIds.has(id)) continue;
      const dueDate = dueDateStringFromDob(dobY, tmpl.daysFromDob);
      const vref = doc(vaccinesCol, id);
      batch.set(
        vref,
        {
          vaccineName: tmpl.vaccineName,
          recommendedAge: tmpl.recommendedAge,
          dueDate,
          status: 'pending',
          completionDate: null,
          notification_2day_sent: false,
          notification_due_sent: false,
          notification_followup_sent: false,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      added += 1;
    }
    if (added > 0) {
      await batch.commit();
      return true;
    }
    return false;
  };

  const loadChildren = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'children'));
      const rows = [];
      for (const c of snap.docs) {
        const childData = { id: c.id, ...c.data() };
        await ensureMissingStandardVaccines(c.id, childData.dob);
        const vSnap = await getDocs(collection(db, 'users', uid, 'children', c.id, 'vaccinations'));
        const vaccines = [];
        vSnap.forEach((d) => vaccines.push({ id: d.id, ...d.data() }));
        vaccines.sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
        rows.push({ ...childData, vaccines });
      }
      setChildren(rows);
    } catch (e) {
      console.error('ChildVaccinationTracker loadChildren', e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const handleSaveChild = async () => {
    if (!uid || !childName.trim()) return;
    const dobStr = formatDob(dob);
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, 'users', uid, 'children'), {
        childName: childName.trim(),
        dob: dobStr,
        createdAt: serverTimestamp(),
      });
      await seedVaccinationsForChild(ref.id, dobStr);
      setShowAdd(false);
      setChildName('');
      setDob(new Date());
      await loadChildren();
    } catch (e) {
      console.error('handleSaveChild', e);
    } finally {
      setSaving(false);
    }
  };

  const openCustomVaccineModal = (childId) => {
    setCustomChildId(childId);
    setCustomVaccineName('');
    setCustomRecommendedAge('');
    setCustomDueDate(new Date());
    setShowCustomDuePicker(false);
    const t0 = new Date();
    t0.setHours(9, 0, 0, 0);
    setCustomReminderTime(t0);
    setShowCustomTimePicker(false);
    setShowCustomModal(true);
  };

  const formatReminderClock = (v) => {
    const h = typeof v.reminderHour === 'number' ? v.reminderHour : 9;
    const m = typeof v.reminderMinute === 'number' ? v.reminderMinute : 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleSaveCustomVaccine = async () => {
    if (!uid || !customChildId || !customVaccineName.trim()) return;
    const dueStr = formatLocalYmd(customDueDate);
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', uid, 'children', customChildId, 'vaccinations'), {
        vaccineName: customVaccineName.trim(),
        recommendedAge: customRecommendedAge.trim() || t('learn.customBadge'),
        dueDate: dueStr,
        status: 'pending',
        completionDate: null,
        notification_2day_sent: false,
        notification_due_sent: false,
        notification_followup_sent: false,
        isCustom: true,
        reminderHour: customReminderTime.getHours(),
        reminderMinute: customReminderTime.getMinutes(),
        reminderTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        createdAt: serverTimestamp(),
      });
      setShowCustomModal(false);
      setCustomChildId(null);
      await loadChildren();
    } catch (e) {
      console.error('handleSaveCustomVaccine', e);
    } finally {
      setSaving(false);
    }
  };

  const handleTestPush = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(t('common.error'), t('learn.testPushSignIn'));
      return;
    }
    setTestPushBusy(true);
    try {
      await user.getIdToken(true);
      await syncFcmTokenToFirestore();
      const fn = httpsCallable(functions, 'scheduleTestPushNotification');
      await fn();
      Alert.alert(t('learn.testPushTitle'), t('learn.testPushBody'));
    } catch (e) {
      console.error('handleTestPush', e);
      const noToken =
        e?.code === 'functions/failed-precondition' ||
        String(e?.message ?? '').includes('No FCM device token');
      Alert.alert(
        t('common.error'),
        noToken ? t('learn.testPushNoTokens') : (e?.message ?? String(e))
      );
    } finally {
      setTestPushBusy(false);
    }
  };

  const markVaccineDone = async (childId, vaccineId) => {
    if (!uid) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await updateDoc(
        doc(db, 'users', uid, 'children', childId, 'vaccinations', vaccineId),
        {
          status: 'completed',
          completionDate: today,
        }
      );
      await loadChildren();
    } catch (e) {
      console.error('markVaccineDone', e);
    } finally {
      setSaving(false);
    }
  };

  const markVaccineUndone = async (childId, vaccineId) => {
    if (!uid) return;
    setSaving(true);
    try {
      await updateDoc(
        doc(db, 'users', uid, 'children', childId, 'vaccinations', vaccineId),
        {
          status: 'pending',
          completionDate: null,
        }
      );
      await loadChildren();
    } catch (e) {
      console.error('markVaccineUndone', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!embedded ? (
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#e91e63" />
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.title}>{t('learn.childVaccinationTitle')}</Text>
      <Text style={styles.subtitle}>{t('learn.childVaccinationSubtitle')}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowAdd(true)} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.primaryBtnText}>{t('learn.addChild')}</Text>
      </TouchableOpacity>

      {uid ? (
        <TouchableOpacity
          style={[styles.secondaryBtn, testPushBusy && { opacity: 0.6 }]}
          onPress={handleTestPush}
          disabled={testPushBusy}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={20} color="#e91e63" />
          <Text style={styles.secondaryBtnText}>{t('learn.testPushButton')}</Text>
        </TouchableOpacity>
      ) : null}

      {children.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="medical-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>{t('learn.noChildrenYet')}</Text>
        </View>
      ) : (
        children.map((child) => (
          <View key={child.id} style={styles.card}>
            <Text style={styles.childName}>{child.childName}</Text>
            <Text style={styles.childMeta}>
              {t('learn.dob')}: {child.dob}
            </Text>
            <Text style={styles.vaccTitle}>{t('learn.vaccineSchedule')}</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>{t('learn.vaccineLegendCompleted')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.legendText}>{t('learn.vaccineLegendDueSoon')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E53935' }]} />
                <Text style={styles.legendText}>{t('learn.vaccineLegendOverdue')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#BDBDBD' }]} />
                <Text style={styles.legendText}>{t('learn.vaccineLegendUpcoming')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addCustomBtn}
              onPress={() => openCustomVaccineModal(child.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-outline" size={20} color="#009688" />
              <Text style={styles.addCustomBtnText}>{t('learn.addCustomVaccine')}</Text>
            </TouchableOpacity>
            {(child.vaccines || []).map((v) => {
              const cat = vaccineStatusCategory(v);
              const rowAccent =
                cat === 'done'
                  ? styles.vaccRowDone
                  : cat === 'overdue'
                    ? styles.vaccRowOverdue
                    : cat === 'dueSoon'
                      ? styles.vaccRowDueSoon
                      : styles.vaccRowUpcoming;
              const statusStyle =
                cat === 'done'
                  ? styles.vaccStatusDone
                  : cat === 'overdue'
                    ? styles.vaccStatusOverdue
                    : cat === 'dueSoon'
                      ? styles.vaccStatusDueSoon
                      : styles.vaccStatusUpcoming;
              return (
                <View key={v.id} style={[styles.vaccRow, rowAccent]}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.vaccNameRow}>
                      <Text style={styles.vaccName}>{v.vaccineName}</Text>
                      {v.isCustom ? (
                        <View style={styles.customBadge}>
                          <Text style={styles.customBadgeText}>{t('learn.customBadge')}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.vaccDue}>
                      {t('learn.due')}: {v.dueDate} · {v.recommendedAge}
                    </Text>
                    {v.isCustom && v.status !== 'completed' ? (
                      <Text style={styles.reminderLine}>
                        {t('learn.reminderTimeLabel')}: {formatReminderClock(v)} (
                        {v.reminderTimezone || 'Asia/Kolkata'})
                      </Text>
                    ) : null}
                    <Text style={[styles.vaccStatus, statusStyle]}>
                      {v.status === 'completed'
                        ? `${t('learn.completed')} (${v.completionDate || ''})`
                        : t('learn.pending')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={v.status === 'completed' ? styles.undoBtn : styles.doneBtn}
                    onPress={() =>
                      v.status === 'completed'
                        ? markVaccineUndone(child.id, v.id)
                        : markVaccineDone(child.id, v.id)
                    }
                    disabled={saving}
                  >
                    <Text style={styles.doneBtnText}>
                      {v.status === 'completed' ? t('learn.markNotDone') : t('learn.markDone')}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))
      )}

      <View style={styles.sourceBox}>
        <Text style={styles.sourceTitle}>{t('learn.vaccinationSourceTitle')}</Text>
        <Text style={styles.sourceBody}>{t('learn.vaccinationSourceBody')}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(MOHFW_SCHEDULE_PDF)}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>{t('learn.viewOfficialSchedule')}</Text>
          <Ionicons name="open-outline" size={18} color="#2196f3" />
        </TouchableOpacity>
        <Text style={styles.disclaimer}>{t('learn.vaccinationDisclaimer')}</Text>
      </View>

      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('learn.addChild')}</Text>
            <Text style={styles.label}>{t('learn.childNameLabel')}</Text>
            <TextInput
              style={styles.input}
              value={childName}
              onChangeText={setChildName}
              placeholder={t('learn.childNamePlaceholder')}
            />
            <Text style={styles.label}>{t('learn.dob')}</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDobPicker(true)}>
              <Text>{formatDob(dob)}</Text>
            </TouchableOpacity>
            {showDobPicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(_, selected) => {
                  setShowDobPicker(Platform.OS === 'ios');
                  if (selected) setDob(selected);
                }}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSaveChild}
                disabled={saving || !childName.trim()}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>{t('common.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCustomModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('learn.customVaccineTitle')}</Text>
            <Text style={styles.label}>{t('learn.vaccineNameLabel')}</Text>
            <TextInput
              style={styles.input}
              value={customVaccineName}
              onChangeText={setCustomVaccineName}
              placeholder={t('learn.vaccineNamePlaceholder')}
            />
            <Text style={styles.label}>{t('learn.recommendedAgeOptional')}</Text>
            <TextInput
              style={styles.input}
              value={customRecommendedAge}
              onChangeText={setCustomRecommendedAge}
              placeholder={t('learn.recommendedAgeOptional')}
            />
            <Text style={styles.label}>{t('learn.dueDateLabel')}</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCustomDuePicker(true)}>
              <Text>{formatLocalYmd(customDueDate)}</Text>
            </TouchableOpacity>
            {showCustomDuePicker && (
              <DateTimePicker
                value={customDueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selected) => {
                  if (Platform.OS !== 'ios') setShowCustomDuePicker(false);
                  if (selected) setCustomDueDate(selected);
                }}
              />
            )}
            <Text style={styles.label}>{t('learn.reminderTimeLabel')}</Text>
            <Text style={styles.hintText}>{t('learn.reminderTimeHint')}</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCustomTimePicker(true)}>
              <Text>
                {customReminderTime.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
            {showCustomTimePicker && (
              <DateTimePicker
                value={customReminderTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selected) => {
                  if (Platform.OS !== 'ios') setShowCustomTimePicker(false);
                  if (selected) setCustomReminderTime(selected);
                }}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowCustomModal(false);
                  setCustomChildId(null);
                }}
              >
                <Text>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, (saving || !customVaccineName.trim()) && { opacity: 0.6 }]}
                onPress={handleSaveCustomVaccine}
                disabled={saving || !customVaccineName.trim()}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>{t('common.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { fontSize: 16, color: '#e91e63', fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e91e63',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  secondaryBtnText: { color: '#e91e63', fontWeight: '600', fontSize: 15 },
  empty: { alignItems: 'center', padding: 32 },
  emptyText: { marginTop: 12, color: '#666' },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  childName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  childMeta: { fontSize: 14, color: '#666', marginBottom: 12 },
  vaccTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#e91e63' },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  addCustomBtnText: { color: '#009688', fontWeight: '600', fontSize: 14 },
  vaccNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  customBadge: {
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customBadgeText: { fontSize: 11, color: '#00695c', fontWeight: '600' },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#555' },
  vaccRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  vaccRowDone: { borderLeftColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  vaccRowDueSoon: { borderLeftColor: '#FF9800', backgroundColor: '#fff8f0' },
  vaccRowOverdue: { borderLeftColor: '#E53935', backgroundColor: '#ffebee' },
  vaccRowUpcoming: { borderLeftColor: '#BDBDBD', backgroundColor: '#fafafa' },
  vaccName: { fontSize: 16, fontWeight: '600', color: '#333' },
  vaccDue: { fontSize: 13, color: '#666', marginTop: 2 },
  reminderLine: { fontSize: 12, color: '#009688', marginTop: 4 },
  hintText: { fontSize: 12, color: '#888', marginBottom: 8, lineHeight: 18 },
  vaccStatus: { fontSize: 12, marginTop: 4 },
  vaccStatusDone: { color: '#2E7D32', fontWeight: '600' },
  vaccStatusDueSoon: { color: '#E65100', fontWeight: '600' },
  vaccStatusOverdue: { color: '#C62828', fontWeight: '600' },
  vaccStatusUpcoming: { color: '#616161', fontWeight: '500' },
  doneBtn: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  undoBtn: {
    backgroundColor: '#607D8B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  sourceBox: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  sourceTitle: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  sourceBody: { fontSize: 13, color: '#555', lineHeight: 20 },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  linkText: { color: '#2196f3', fontWeight: '600' },
  disclaimer: { fontSize: 11, color: '#777', marginTop: 12, fontStyle: 'italic' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: 12 },
  saveBtn: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});

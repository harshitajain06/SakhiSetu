import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import InformationIcon from '../components/InformationIcon';
import { auth, db } from '../config/firebase';
import { useTranslation } from '../contexts/TranslationContext';

export default function PregnancyTrackerScreen() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showBPModal, setShowBPModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDateDetailsModal, setShowDateDetailsModal] = useState(false);
  const [showAppointmentCalendar, setShowAppointmentCalendar] = useState(false);
  const [showDueDateCalendar, setShowDueDateCalendar] = useState(false);
  const [showAppointmentDateCalendar, setShowAppointmentDateCalendar] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [tempDueDate, setTempDueDate] = useState('');
  const [dateErrors, setDateErrors] = useState({});
  const [tempWeight, setTempWeight] = useState('');
  const [tempWeightDate, setTempWeightDate] = useState('');
  const [showWeightDateCalendar, setShowWeightDateCalendar] = useState(false);
  const [tempSystolic, setTempSystolic] = useState('');
  const [tempDiastolic, setTempDiastolic] = useState('');
  const [tempBPDate, setTempBPDate] = useState('');
  const [showBPDateCalendar, setShowBPDateCalendar] = useState(false);
  const [tempAppointment, setTempAppointment] = useState({
    type: '',
    date: '',
    time: '',
    doctor: ''
  });
  const [pregnancyData, setPregnancyData] = useState({
    dueDate: null, // Will be set by user
    lastPeriod: null,
    weightGain: 0,
    bloodPressure: '120/80',
    lastCheckup: null,
    isSetup: false // Flag to check if pregnancy data has been configured
  });
  const [weightHistory, setWeightHistory] = useState([]);
  const [bpHistory, setBPHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pregnancySymptoms, setPregnancySymptoms] = useState([]);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [showSymptomDetailModal, setShowSymptomDetailModal] = useState(false);
  const [selectedSymptomDetail, setSelectedSymptomDetail] = useState(null);
  const [newSymptom, setNewSymptom] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('Light');
  const [editingWeight, setEditingWeight] = useState(null);
  const [editingBP, setEditingBP] = useState(null);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState(null); // 'weight', 'bp', 'symptom', 'appointment'
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [appointments, setAppointments] = useState([]);

  // Get translated severity text
  const getSeverityText = (severity) => {
    switch (severity) {
      case 'Severe':
        return t('pregnancyTracker.severe');
      case 'Moderate':
        return t('pregnancyTracker.moderate');
      case 'Light':
        return t('pregnancyTracker.light');
      default:
        return severity;
    }
  };

  // Pregnancy symptom options
  const pregnancySymptomOptions = [
    t('pregnancyTracker.backLegPain'),
    t('pregnancyTracker.frequentUrination'),
    t('pregnancyTracker.swollenBreasts'),
    t('pregnancyTracker.vomitNausea'),
    t('pregnancyTracker.heartburn'),
    t('pregnancyTracker.abdominalPain')
  ];

  // Get symptom card background color based on severity
  const getSymptomCardColor = (severity) => {
    switch (severity) {
      case 'Severe':
        return '#ffebee'; // Light red
      case 'Moderate':
        return '#fff9c4'; // Light yellow
      case 'Light':
        return '#e8f5e9'; // Light green
      default:
        return '#f8f9fa'; // Default gray
    }
  };

  // Pregnancy symptom content based on type and severity
  const getPregnancySymptomContent = (symptomType, severity) => {
    const content = {
      'Back/leg pain': {
        'Light': 'Maintain good posture, wear supportive flat shoes, and avoid heavy lifting. Use a pillow behind your back while sitting.',
        'Moderate': 'Use a pregnancy support belt to take some weight off your back. Sleep on your side with a pillow between your knees and under your belly. A warm water bottle or pack on the lowest setting can soothe muscles.',
        'Severe': 'If pain persists for more than two weeks, talk to your doctor. They might recommend physical therapy, massage from a certified prenatal therapist, or safe exercises.'
      },
      'Frequent urination': {
        'Light': 'Lean forward when you urinate to empty your bladder completely. Reduce evening fluid intake to limit nighttime trips to the bathroom.',
        'Moderate': 'Strengthen your pelvic floor muscles with daily Kegel exercises. Avoid caffeine and other diuretics.',
        'Severe': 'If urination is painful or accompanied by a fever, it could be a urinary tract infection (UTI) and needs a doctor\'s attention.'
      },
      'Swollen breasts': {
        'Light': 'Wear a supportive, well-fitting maternity bra, and consider wearing one at night. Use a cotton bra to let your skin breathe.',
        'Moderate': 'Use a cool compress or chilled cabbage leaf to reduce swelling and tenderness. A warm shower can also help relax breast tissue.',
        'Severe': 'Sudden, severe pain, especially with redness, warmth, or hard lumps, should be checked by a doctor, as it could signal a more serious condition.'
      },
      'Vomit/Nausea': {
        'Light': 'Eat a few crackers or dry toast before getting out of bed in the morning. Eat small, frequent, and bland meals throughout the day.',
        'Moderate': 'Sip on ginger tea, ginger ale, or use acupressure wristbands. Avoid strong smells and greasy or spicy foods.',
        'Severe': 'If you can\'t keep any food or fluids down for 24 hours, contact your doctor to prevent dehydration. You may need intravenous fluids or anti-nausea medication.'
      },
      'Heartburn': {
        'Light': 'Avoid lying down right after eating. Wait at least two to three hours. Wear loose-fitting clothes.',
        'Moderate': 'Sleep with your head propped up on extra pillows. Eat small meals slowly and avoid spicy, greasy, or acidic foods.',
        'Severe': 'If moderate remedies don\'t help, talk to your doctor. Certain antacids like Tums may be recommended, but it is important to confirm with a healthcare provider.'
      },
      'Abdominal pain': {
        'Light': 'Move slowly when changing position to avoid round ligament pain. A warm bath can relax tense muscles.',
        'Moderate': 'Wear a maternity belt for extra support. Make sure you are well-hydrated to help with constipation-related pain.',
        'Severe': 'Contact a doctor immediately if you experience persistent or constant pain, especially if it\'s accompanied by bleeding, fever, or contractions.'
      }
    };

    return content[symptomType]?.[severity] || 'No information available.';
  };

  // Get current user ID
  const getCurrentUserId = () => {
    return auth.currentUser?.uid;
  };

  // Firestore data management functions
  const savePregnancyData = async (data) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        pregnancyData: data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      console.log('Pregnancy data saved successfully');
    } catch (error) {
      console.error('Error saving pregnancy data:', error);
      Alert.alert(t('common.error'), t('pregnancyTracker.failedToSavePregnancyData'));
    } finally {
      setSaving(false);
    }
  };

  const fetchPregnancyData = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.pregnancyData) {
          setPregnancyData(userData.pregnancyData);
        }
      }
    } catch (error) {
      console.error('Error fetching pregnancy data:', error);
      Alert.alert(t('common.error'), t('pregnancyTracker.failedToLoadPregnancyData'));
    } finally {
      setLoading(false);
    }
  };

  const saveWeightEntry = async (weightEntry) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const weightCollectionRef = collection(db, 'users', userId, 'weightHistory');
      await addDoc(weightCollectionRef, weightEntry);
      
      console.log('Weight entry saved successfully');
    } catch (error) {
      console.error('Error saving weight entry:', error);
      Alert.alert(t('common.error'), t('pregnancyTracker.failedToSaveWeightEntry'));
    } finally {
      setSaving(false);
    }
  };

  const fetchWeightHistory = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const weightCollectionRef = collection(db, 'users', userId, 'weightHistory');
      const q = query(weightCollectionRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const weightData = [];
      querySnapshot.forEach((doc) => {
        weightData.push({ id: doc.id, ...doc.data() });
      });
      
      setWeightHistory(weightData);
    } catch (error) {
      console.error('Error fetching weight history:', error);
    }
  };

  const saveBPEntry = async (bpEntry) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const bpCollectionRef = collection(db, 'users', userId, 'bpHistory');
      await addDoc(bpCollectionRef, bpEntry);
      
      console.log('BP entry saved successfully');
    } catch (error) {
      console.error('Error saving BP entry:', error);
      Alert.alert(t('common.error'), t('pregnancyTracker.failedToSaveBPEntry'));
    } finally {
      setSaving(false);
    }
  };

  const fetchBPHistory = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const bpCollectionRef = collection(db, 'users', userId, 'bpHistory');
      const q = query(bpCollectionRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bpData = [];
      querySnapshot.forEach((doc) => {
        bpData.push({ id: doc.id, ...doc.data() });
      });
      
      setBPHistory(bpData);
    } catch (error) {
      console.error('Error fetching BP history:', error);
    }
  };

  // Fetch pregnancy symptoms
  const fetchPregnancySymptoms = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const symptomsCollectionRef = collection(db, 'users', userId, 'pregnancySymptoms');
      const q = query(symptomsCollectionRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const symptomsData = [];
      querySnapshot.forEach((doc) => {
        symptomsData.push({ id: doc.id, ...doc.data() });
      });
      
      setPregnancySymptoms(symptomsData);
    } catch (error) {
      console.error('Error fetching pregnancy symptoms:', error);
    }
  };

  // Save pregnancy symptom data
  const savePregnancySymptomData = async () => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      if (!newSymptom) {
        Alert.alert(t('common.error'), t('pregnancyTracker.pleaseSelectSymptom'));
        return;
      }

      if (editingSymptom) {
        // Update existing symptom
        await updateSymptom(editingSymptom.id, {
          symptom: newSymptom,
          severity: symptomSeverity,
          date: selectedDate
        });
        setEditingSymptom(null);
      } else {
        // Create new symptom
        const symptomData = {
          symptom: newSymptom,
          severity: symptomSeverity,
          date: selectedDate,
          createdAt: new Date()
        };

        await addDoc(collection(db, 'users', userId, 'pregnancySymptoms'), symptomData);
      }

      // Refresh data
      await fetchPregnancySymptoms();
      
      Alert.alert(t('common.success'), editingSymptom ? 'Symptom updated' : t('pregnancyTracker.symptomLogged'));
      setShowSymptomModal(false);
      setNewSymptom('');
      setSymptomSeverity('Light');
      setEditingSymptom(null);
    } catch (error) {
      console.error('Error saving pregnancy symptom data:', error);
      Alert.alert(t('common.error'), t('pregnancyTracker.failedToSaveSymptomData'));
    } finally {
      setSaving(false);
    }
  };

  const saveAppointment = async (appointment) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const appointmentCollectionRef = collection(db, 'users', userId, 'appointments');
      await addDoc(appointmentCollectionRef, appointment);
      
      console.log('Appointment saved successfully');
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert(t('common.error'), t('pregnancyTracker.failedToSaveAppointment'));
    } finally {
      setSaving(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const appointmentCollectionRef = collection(db, 'users', userId, 'appointments');
      const q = query(appointmentCollectionRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const appointmentData = [];
      querySnapshot.forEach((doc) => {
        appointmentData.push({ id: doc.id, ...doc.data() });
      });
      
      setAppointments(appointmentData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (type, id) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete after modal confirmation
  const confirmDelete = async () => {
    if (!deleteItemType || !deleteItemId) return;

    setShowDeleteModal(false);
    
    switch (deleteItemType) {
      case 'weight':
        await deleteWeightEntry(deleteItemId);
        break;
      case 'bp':
        await deleteBPEntry(deleteItemId);
        break;
      case 'symptom':
        await deleteSymptom(deleteItemId);
        break;
      case 'appointment':
        await deleteAppointment(deleteItemId);
        break;
    }

    // Reset state
    setDeleteItemType(null);
    setDeleteItemId(null);
  };

  // Delete functions
  const deleteWeightEntry = async (entryId) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const weightDocRef = doc(db, 'users', userId, 'weightHistory', entryId);
      await deleteDoc(weightDocRef);
      
      // Update local state
      const updatedHistory = weightHistory.filter(entry => entry.id !== entryId);
      setWeightHistory(updatedHistory);
      
      // Recalculate weight gain (difference between current weight and first entry)
      if (updatedHistory.length >= 2) {
        const currentWeight = updatedHistory[0].weight;
        const firstWeight = updatedHistory[updatedHistory.length - 1].weight;
        const weightGain = currentWeight - firstWeight;
        
        const updatedPregnancyData = {
          ...pregnancyData,
          weightGain: Math.round(weightGain * 10) / 10
        };
        setPregnancyData(updatedPregnancyData);
        await savePregnancyData(updatedPregnancyData);
      } else {
        const updatedPregnancyData = {
          ...pregnancyData,
          weightGain: 0
        };
        setPregnancyData(updatedPregnancyData);
        await savePregnancyData(updatedPregnancyData);
      }
      
      Alert.alert(t('common.success'), 'Weight entry deleted');
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      Alert.alert(t('common.error'), 'Failed to delete weight entry');
    } finally {
      setSaving(false);
    }
  };


  const deleteBPEntry = async (entryId) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const bpDocRef = doc(db, 'users', userId, 'bpHistory', entryId);
      await deleteDoc(bpDocRef);
      
      setBPHistory(prev => prev.filter(entry => entry.id !== entryId));
      
      Alert.alert(t('common.success'), 'Blood pressure entry deleted');
    } catch (error) {
      console.error('Error deleting BP entry:', error);
      Alert.alert(t('common.error'), 'Failed to delete blood pressure entry');
    } finally {
      setSaving(false);
    }
  };

  const deleteSymptom = async (symptomId) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const symptomDocRef = doc(db, 'users', userId, 'pregnancySymptoms', symptomId);
      await deleteDoc(symptomDocRef);
      
      setPregnancySymptoms(prev => prev.filter(symptom => symptom.id !== symptomId));
      
      Alert.alert(t('common.success'), 'Symptom deleted');
    } catch (error) {
      console.error('Error deleting symptom:', error);
      Alert.alert(t('common.error'), 'Failed to delete symptom');
    } finally {
      setSaving(false);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const appointmentDocRef = doc(db, 'users', userId, 'appointments', appointmentId);
      await deleteDoc(appointmentDocRef);
      
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      
      Alert.alert(t('common.success'), 'Appointment deleted');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      Alert.alert(t('common.error'), 'Failed to delete appointment');
    } finally {
      setSaving(false);
    }
  };

  // Update functions
  const updateWeightEntry = async (entryId, updatedData) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const weightDocRef = doc(db, 'users', userId, 'weightHistory', entryId);
      await updateDoc(weightDocRef, updatedData);
      
      // Refresh weight history
      await fetchWeightHistory();
      
      Alert.alert(t('common.success'), 'Weight entry updated');
    } catch (error) {
      console.error('Error updating weight entry:', error);
      Alert.alert(t('common.error'), 'Failed to update weight entry');
    } finally {
      setSaving(false);
    }
  };

  const updateBPEntry = async (entryId, updatedData) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const bpDocRef = doc(db, 'users', userId, 'bpHistory', entryId);
      await updateDoc(bpDocRef, updatedData);
      
      // Refresh BP history
      await fetchBPHistory();
      
      Alert.alert(t('common.success'), 'Blood pressure entry updated');
    } catch (error) {
      console.error('Error updating BP entry:', error);
      Alert.alert(t('common.error'), 'Failed to update blood pressure entry');
    } finally {
      setSaving(false);
    }
  };

  const updateSymptom = async (symptomId, updatedData) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const symptomDocRef = doc(db, 'users', userId, 'pregnancySymptoms', symptomId);
      await updateDoc(symptomDocRef, updatedData);
      
      // Refresh symptoms
      await fetchPregnancySymptoms();
      
      Alert.alert(t('common.success'), 'Symptom updated');
    } catch (error) {
      console.error('Error updating symptom:', error);
      Alert.alert(t('common.error'), 'Failed to update symptom');
    } finally {
      setSaving(false);
    }
  };

  const updateAppointment = async (appointmentId, updatedData) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert(t('common.error'), t('pregnancyTracker.userNotAuthenticated'));
        return;
      }

      const appointmentDocRef = doc(db, 'users', userId, 'appointments', appointmentId);
      await updateDoc(appointmentDocRef, updatedData);
      
      // Refresh appointments
      await fetchAppointments();
      
      Alert.alert(t('common.success'), 'Appointment updated');
    } catch (error) {
      console.error('Error updating appointment:', error);
      Alert.alert(t('common.error'), 'Failed to update appointment');
    } finally {
      setSaving(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPregnancyData(),
        fetchWeightHistory(),
        fetchBPHistory(),
        fetchAppointments(),
        fetchPregnancySymptoms()
      ]);
    };
    
    loadData();
  }, []);

  const calculateDaysUntilDue = () => {
    if (!pregnancyData.dueDate) return 0;
    const dueDate = new Date(pregnancyData.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate weight gain as difference from the first weight entry
  const calculateWeightGain = () => {
    if (weightHistory.length < 2) {
      return 0; // No previous entry to compare with
    }
    // weightHistory is sorted by timestamp desc, so [0] is most recent, [length-1] is first entry
    const currentWeight = weightHistory[0].weight;
    const firstWeight = weightHistory[weightHistory.length - 1].weight;
    return Math.round((currentWeight - firstWeight) * 10) / 10; // Round to 1 decimal place
  };

  // Validate due date
  const validateDueDate = (date) => {
    const errors = {};
    const today = new Date();
    const selectedDate = new Date(date);
    
    if (!date) {
      errors.dueDate = t('pregnancyTracker.dueDateRequired');
    } else if (isNaN(selectedDate.getTime())) {
      errors.dueDate = t('pregnancyTracker.invalidDateFormat');
    } else if (selectedDate <= today) {
      errors.dueDate = t('pregnancyTracker.dueDateMustBeFuture');
    } else {
    // Calculate LMP (40 weeks before due date)
    const lmpDate = new Date(selectedDate);
    lmpDate.setDate(lmpDate.getDate() - (40 * 7));
    
    // Validate pregnancy timeframe (LMP should not be more than 42 weeks ago)
    const maxLMPDate = new Date(today);
      maxLMPDate.setDate(maxLMPDate.getDate() - (42 * 7));
    
    if (lmpDate < maxLMPDate) {
        errors.dueDate = t('pregnancyTracker.dueDateTooFar');
    }
    
    // Validate that due date is not too far in the future (max 10 months)
    const maxDueDate = new Date(today);
    maxDueDate.setMonth(maxDueDate.getMonth() + 10);
    
    if (selectedDate > maxDueDate) {
        errors.dueDate = t('pregnancyTracker.dueDateTooFar');
      }
    }
    
    setDateErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Validate appointment date
  const validateAppointmentDate = (date) => {
    const errors = {};
    const today = new Date();
    const selectedDate = new Date(date);
    
    if (!date) {
      errors.appointmentDate = t('pregnancyTracker.appointmentDateRequired');
    } else if (isNaN(selectedDate.getTime())) {
      errors.appointmentDate = t('pregnancyTracker.invalidDateFormat');
    } else if (selectedDate < today) {
      errors.appointmentDate = t('pregnancyTracker.appointmentDateCannotBePast');
    }
    
    setDateErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Handle due date selection from calendar
  const handleDueDateSelect = (day) => {
    if (day && day.dateString) {
      setTempDueDate(day.dateString);
      setShowDueDateCalendar(false);
      // Clear due date error when user selects a date
      if (dateErrors.dueDate) {
        setDateErrors(prev => ({ ...prev, dueDate: null }));
      }
    }
  };

  // Handle appointment date selection from calendar
  const handleAppointmentDateSelect = (day) => {
    if (day && day.dateString) {
      setTempAppointment(prev => ({ ...prev, date: day.dateString }));
      setShowAppointmentDateCalendar(false);
      // Clear appointment date error when user selects a date
      if (dateErrors.appointmentDate) {
        setDateErrors(prev => ({ ...prev, appointmentDate: null }));
      }
    }
  };

  const handleSetDueDate = async () => {
    // Validate due date
    if (!validateDueDate(tempDueDate)) {
      Alert.alert(t('pregnancyTracker.validationError'), t('pregnancyTracker.fixDateErrors'));
      return;
    }
    
    const selectedDate = new Date(tempDueDate);
    const today = new Date();
    
    // Calculate LMP (40 weeks before due date)
    const lmpDate = new Date(selectedDate);
    lmpDate.setDate(lmpDate.getDate() - (40 * 7));
    
    // Validate LMP date before using it
    const lmpDateString = !isNaN(lmpDate.getTime()) ? lmpDate.toISOString().split('T')[0] : null;
    
    const updatedPregnancyData = {
      ...pregnancyData,
      dueDate: tempDueDate,
      lastPeriod: lmpDateString,
      isSetup: true
    };
    
    setPregnancyData(updatedPregnancyData);
    await savePregnancyData(updatedPregnancyData);
    
    setShowDueDateModal(false);
    setTempDueDate('');
    Alert.alert(t('common.success'), t('pregnancyTracker.dueDateSaved'));
  };

  const handleEditDueDate = () => {
    setTempDueDate(pregnancyData.dueDate || '');
    setShowDueDateModal(true);
  };

  const calculateCurrentWeek = () => {
    if (!pregnancyData.dueDate) return 0;
    
    const dueDate = new Date(pregnancyData.dueDate);
    const today = new Date();
    
    // Calculate weeks from LMP (Last Menstrual Period)
    // Pregnancy is typically 40 weeks from LMP, so due date is 40 weeks from LMP
    const lmpDate = new Date(dueDate);
    lmpDate.setDate(lmpDate.getDate() - (40 * 7)); // Subtract 40 weeks from due date to get LMP
    
    const diffTime = today - lmpDate;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    // Ensure week is between 1 and 42 (normal pregnancy range)
    return Math.max(1, Math.min(42, diffWeeks));
  };

  const calculateCurrentTrimester = (week) => {
    if (week <= 12) return 1;
    if (week <= 28) return 2;
    return 3;
  };

  const getCurrentWeek = calculateCurrentWeek();
  const getCurrentTrimester = calculateCurrentTrimester(getCurrentWeek);

  const getMilestones = () => {
    const currentWeek = getCurrentWeek;
    return [
      { week: 8, title: t('pregnancyTracker.heartbeatDetectable'), completed: currentWeek >= 8 },
      { week: 12, title: t('pregnancyTracker.firstTrimesterScreening'), completed: currentWeek >= 12 },
      { week: 16, title: t('pregnancyTracker.genderRevealPossible'), completed: currentWeek >= 16 },
      { week: 20, title: t('pregnancyTracker.anatomyScan'), completed: currentWeek >= 20 },
      { week: 24, title: t('pregnancyTracker.viabilityMilestone'), completed: currentWeek >= 24 },
      { week: 28, title: t('pregnancyTracker.thirdTrimesterBegins'), completed: currentWeek >= 28 },
    ];
  };

  const milestones = getMilestones();

  const getTrimesterColor = (trimester) => {
    switch (trimester) {
      case 1: return '#ff6b6b';
      case 2: return '#4ecdc4';
      case 3: return '#45b7d1';
      default: return '#95a5a6';
    }
  };

  const handleLogSymptom = () => {
    setEditingSymptom(null);
    setNewSymptom('');
    setSymptomSeverity('Light');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setShowSymptomModal(true);
  };

  const handleEditSymptom = (symptom) => {
    setEditingSymptom(symptom);
    setNewSymptom(symptom.symptom);
    setSymptomSeverity(symptom.severity);
    setSelectedDate(symptom.date);
    setShowSymptomDetailModal(false);
    setShowSymptomModal(true);
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setTempAppointment({
      type: '',
      date: '',
      time: '',
      doctor: ''
    });
    setShowAppointmentModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setTempAppointment({
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      doctor: appointment.doctor
    });
    setShowAppointmentModal(true);
  };


  const handleSaveAppointment = async () => {
    if (!tempAppointment.type || !tempAppointment.date || !tempAppointment.time || !tempAppointment.doctor) {
      Alert.alert(t('common.error'), t('pregnancyTracker.pleaseFillAllAppointmentDetails'));
      return;
    }

    // Validate appointment date
    if (!validateAppointmentDate(tempAppointment.date)) {
      Alert.alert(t('pregnancyTracker.validationError'), t('pregnancyTracker.fixDateErrors'));
      return;
    }

    if (editingAppointment) {
      // Update existing appointment
      await updateAppointment(editingAppointment.id, {
        type: tempAppointment.type,
        date: tempAppointment.date,
        time: tempAppointment.time,
        doctor: tempAppointment.doctor
      });
      setEditingAppointment(null);
      // Refresh appointments
      await fetchAppointments();
    } else {
      // Create new appointment
      const newAppointment = {
        type: tempAppointment.type,
        date: tempAppointment.date,
        time: tempAppointment.time,
        doctor: tempAppointment.doctor,
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      await saveAppointment(newAppointment);
      
      // Update local state
      setAppointments(prev => [newAppointment, ...prev].sort((a, b) => new Date(a.date) - new Date(b.date)));
    }

    setShowAppointmentModal(false);
    setTempAppointment({
      type: '',
      date: '',
      time: '',
      doctor: ''
    });
    Alert.alert(t('common.success'), editingAppointment ? 'Appointment updated' : t('pregnancyTracker.appointmentAdded'));
  };

  const handleLogWeight = () => {
    setEditingWeight(null);
    setTempWeight('');
    setTempWeightDate(new Date().toISOString().split('T')[0]); // Default to today
    setShowWeightModal(true);
  };

  const handleEditWeight = (entry) => {
    setEditingWeight(entry);
    setTempWeight(entry.weight.toString());
    setTempWeightDate(entry.date);
    setShowWeightModal(true);
  };

  const handleWeightDateSelect = (day) => {
    if (day && day.dateString) {
      setTempWeightDate(day.dateString);
      setShowWeightDateCalendar(false);
    }
  };

  const handleSaveWeight = async () => {
    if (!tempWeight || isNaN(parseFloat(tempWeight))) {
      Alert.alert(t('common.error'), t('pregnancyTracker.pleaseEnterValidWeight'));
      return;
    }

    const weight = parseFloat(tempWeight);
    if (weight < 30 || weight > 200) {
      Alert.alert(t('common.error'), t('pregnancyTracker.pleaseEnterRealisticWeight'));
      return;
    }

    const selectedDate = tempWeightDate || new Date().toISOString().split('T')[0];

    if (editingWeight) {
      // Update existing entry
      await updateWeightEntry(editingWeight.id, { weight, date: selectedDate });
      setEditingWeight(null);
      // Refresh to recalculate weight gain
      await fetchWeightHistory();
    } else {
      // Create new entry
      const newWeightEntry = {
        weight: weight,
        date: selectedDate,
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      await saveWeightEntry(newWeightEntry);
      
      // Calculate weight gain as difference from the first weight entry
      // weightHistory[weightHistory.length - 1] is the first (oldest) entry
      const firstWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null;
      const weightGain = firstWeight !== null ? weight - firstWeight : 0;
      
      // Update local state
      setWeightHistory(prev => [newWeightEntry, ...prev]);
      
      // Update pregnancy data with weight gain (difference from first entry)
      const updatedPregnancyData = {
        ...pregnancyData,
        weightGain: Math.round(weightGain * 10) / 10 // Round to 1 decimal place
      };
      
      setPregnancyData(updatedPregnancyData);
      await savePregnancyData(updatedPregnancyData);
    }

    setShowWeightModal(false);
    setTempWeight('');
    setTempWeightDate('');
    Alert.alert(t('common.success'), editingWeight ? 'Weight entry updated' : t('pregnancyTracker.weightLogged'));
  };

  const handleLogBloodPressure = () => {
    setEditingBP(null);
    setTempSystolic('');
    setTempDiastolic('');
    setTempBPDate(new Date().toISOString().split('T')[0]); // Default to today
    setShowBPModal(true);
  };

  const handleEditBP = (entry) => {
    setEditingBP(entry);
    setTempSystolic(entry.systolic.toString());
    setTempDiastolic(entry.diastolic.toString());
    setTempBPDate(entry.date);
    setShowBPModal(true);
  };

  const handleBPDateSelect = (day) => {
    if (day && day.dateString) {
      setTempBPDate(day.dateString);
      setShowBPDateCalendar(false);
    }
  };

  const handleSaveBloodPressure = async () => {
    if (!tempSystolic || !tempDiastolic || isNaN(parseInt(tempSystolic)) || isNaN(parseInt(tempDiastolic))) {
      Alert.alert(t('common.error'), t('pregnancyTracker.pleaseEnterValidBP'));
      return;
    }

    const systolic = parseInt(tempSystolic);
    const diastolic = parseInt(tempDiastolic);

    if (systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 120) {
      Alert.alert(t('common.error'), t('pregnancyTracker.pleaseEnterRealisticBP'));
      return;
    }

    const selectedDate = tempBPDate || new Date().toISOString().split('T')[0];

    if (editingBP) {
      // Update existing entry
      await updateBPEntry(editingBP.id, { systolic, diastolic, date: selectedDate });
      setEditingBP(null);
      // Refresh to update latest BP
      await fetchBPHistory();
      // Update pregnancy data with latest BP
      const updatedPregnancyData = {
        ...pregnancyData,
        bloodPressure: `${systolic}/${diastolic}`
      };
      setPregnancyData(updatedPregnancyData);
      await savePregnancyData(updatedPregnancyData);
    } else {
      // Create new entry
      const newBPEntry = {
        systolic: systolic,
        diastolic: diastolic,
        date: selectedDate,
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      await saveBPEntry(newBPEntry);
      
      // Update local state
      setBPHistory(prev => [newBPEntry, ...prev]);
      
      // Update pregnancy data with latest BP
      const updatedPregnancyData = {
        ...pregnancyData,
        bloodPressure: `${systolic}/${diastolic}`
      };
      
      setPregnancyData(updatedPregnancyData);
      await savePregnancyData(updatedPregnancyData);
    }

    setShowBPModal(false);
    setTempSystolic('');
    setTempDiastolic('');
    setTempBPDate('');
    Alert.alert(t('common.success'), editingBP ? 'Blood pressure entry updated' : t('pregnancyTracker.bpLogged'));
  };

  const getMarkedDates = () => {
    const marked = {};
    const dateTypes = {}; // Track which types of entries exist for each date
    
    // Track due date
    if (pregnancyData.dueDate) {
      const date = pregnancyData.dueDate;
      if (!dateTypes[date]) dateTypes[date] = [];
      dateTypes[date].push('dueDate');
    }
    
    // Track appointments
    appointments.forEach(appointment => {
      if (appointment.date) {
        if (!dateTypes[appointment.date]) dateTypes[appointment.date] = [];
        if (!dateTypes[appointment.date].includes('appointment')) {
          dateTypes[appointment.date].push('appointment');
        }
      }
    });
    
    // Track weight logs
    weightHistory.forEach(entry => {
      if (entry.date) {
        if (!dateTypes[entry.date]) dateTypes[entry.date] = [];
        if (!dateTypes[entry.date].includes('weight')) {
          dateTypes[entry.date].push('weight');
        }
      }
    });
    
    // Track blood pressure logs
    bpHistory.forEach(entry => {
      if (entry.date) {
        if (!dateTypes[entry.date]) dateTypes[entry.date] = [];
        if (!dateTypes[entry.date].includes('bp')) {
          dateTypes[entry.date].push('bp');
        }
      }
    });
    
    // Track pregnancy milestones
    milestones.forEach(milestone => {
      if (milestone.completed && pregnancyData.dueDate) {
        const milestoneDate = new Date(pregnancyData.dueDate);
        if (isNaN(milestoneDate.getTime())) return;
        
        milestoneDate.setDate(milestoneDate.getDate() - ((40 - milestone.week) * 7));
        const dateString = milestoneDate.toISOString().split('T')[0];
        
        if (!dateTypes[dateString]) dateTypes[dateString] = [];
        if (!dateTypes[dateString].includes('milestone')) {
          dateTypes[dateString].push('milestone');
        }
      }
    });
    
    // Build marked dates with dots arrays
    Object.keys(dateTypes).forEach(date => {
      const types = dateTypes[date];
      const dots = [];
      let isDueDate = false;
      
      // Define colors for each type
      const typeColors = {
        dueDate: '#e91e63',
        appointment: '#2196F3',
        weight: '#4CAF50',
        bp: '#ff9800',
        milestone: '#9c27b0'
      };
      
      // Build dots array (format: { color, selectedDotColor })
      if (types.includes('dueDate')) {
        isDueDate = true;
        dots.push({ color: typeColors.dueDate, selectedDotColor: '#ffffff' });
      }
      if (types.includes('appointment')) {
        dots.push({ color: typeColors.appointment, selectedDotColor: '#ffffff' });
      }
      if (types.includes('weight')) {
        dots.push({ color: typeColors.weight, selectedDotColor: '#ffffff' });
      }
      if (types.includes('bp')) {
        dots.push({ color: typeColors.bp, selectedDotColor: '#ffffff' });
      }
      if (types.includes('milestone')) {
        dots.push({ color: typeColors.milestone, selectedDotColor: '#ffffff' });
      }
      
      // Build the marked date entry
      const entry = {};
      
      // Always use dots array format for consistency with markingType='multi-dot'
      // This works for both single and multiple dots
      if (dots.length > 0) {
        entry.dots = dots;
        // Debug: uncomment to verify dots are created
        // console.log(`Date ${date} has ${dots.length} dots:`, dots.map(d => d.color));
      }
      
      // Special styling for due date (highest priority)
      // Note: customStyles can interfere with dots display, so we only use it for due date only
      if (isDueDate && dots.length === 1) {
        // Due date only - use special styling
        entry.selected = true;
        entry.selectedColor = '#e91e63';
        entry.customStyles = {
          container: {
            backgroundColor: '#e91e63',
            borderRadius: 16,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          }
        };
      } else if (isDueDate && dots.length > 1) {
        // Due date with other entries - show multi-dot, selected background but let dots show
        entry.selected = true;
        entry.selectedColor = '#e91e63';
      }
      // For other entries, dots array handles the visual indication
      
      marked[date] = entry;
    });
    
    return marked;
  };

  const getDateDetails = (dateString) => {
    const details = {
      date: dateString,
      appointments: [],
      weightLogs: [],
      bpLogs: [],
      milestones: []
    };

    // Get appointments for this date
    details.appointments = appointments.filter(apt => apt.date === dateString);

    // Get weight logs for this date
    details.weightLogs = weightHistory.filter(log => log.date === dateString);

    // Get BP logs for this date
    details.bpLogs = bpHistory.filter(log => log.date === dateString);

    // Check if this is a milestone date
    if (pregnancyData.dueDate) {
      milestones.forEach(milestone => {
        if (milestone.completed) {
          const milestoneDate = new Date(pregnancyData.dueDate);
          // Validate the date before using it
          if (isNaN(milestoneDate.getTime())) return;
          
          milestoneDate.setDate(milestoneDate.getDate() - ((40 - milestone.week) * 7));
          const milestoneDateString = milestoneDate.toISOString().split('T')[0];
          
          if (milestoneDateString === dateString) {
            details.milestones.push(milestone);
          }
        }
      });
    }

    return details;
  };

  const handleDatePress = (day) => {
    const dateDetails = getDateDetails(day.dateString);
    setSelectedCalendarDate(dateDetails);
    setShowDateDetailsModal(true);
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>{t('pregnancyTracker.loadingData')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('pregnancyTracker.pregnancyTracker')}</Text>
        <View style={styles.headerRight}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Current Status */}
      {!pregnancyData.isSetup ? (
        <View style={[styles.statusCard, { backgroundColor: '#f0f0f0' }]}>
          <View style={styles.statusHeader}>
            <Ionicons name="baby" size={24} color="#666" />
            <Text style={[styles.statusTitle, { color: '#666' }]}>
              {t('pregnancyTracker.welcomeTitle')}
            </Text>
          </View>
          <Text style={styles.statusText}>{t('pregnancyTracker.setDueDatePrompt')}</Text>
          <TouchableOpacity style={styles.setupButton} onPress={() => setShowDueDateModal(true)}>
            <Text style={styles.setupButtonText}>{t('pregnancyTracker.setDueDate')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.statusCard, { backgroundColor: getTrimesterColor(getCurrentTrimester) + '20' }]}>
          <View style={styles.statusHeader}>
            <Ionicons name="baby" size={24} color={getTrimesterColor(getCurrentTrimester)} />
            <Text style={[styles.statusTitle, { color: getTrimesterColor(getCurrentTrimester) }]}>
              {t('pregnancyTracker.week')} {getCurrentWeek} - {t('pregnancyTracker.trimester')} {getCurrentTrimester}
            </Text>
            <TouchableOpacity onPress={handleEditDueDate} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.statusText}>{t('pregnancyTracker.dueDate')} {pregnancyData.dueDate}</Text>
          <Text style={styles.statusSubtext}>
            {t('pregnancyTracker.daysToGo', { days: calculateDaysUntilDue() })}
          </Text>
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="scale-outline" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>
            {(() => {
              const weightGain = calculateWeightGain();
              return weightGain > 0 ? `+${weightGain}` : weightGain < 0 ? `${weightGain}` : '0';
            })()} kg
          </Text>
          <Text style={styles.statLabel}>Weight Gain</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="heart-outline" size={24} color="#e91e63" />
          <Text style={styles.statValue}>{pregnancyData.bloodPressure}</Text>
          <Text style={styles.statLabel}>Blood Pressure</Text>
        </View>
         <View style={styles.statCard}>
           <Ionicons name="calendar-outline" size={24} color="#2196F3" />
           <Text style={styles.statValue}>{getCurrentWeek}</Text>
           <Text style={styles.statLabel}>Weeks Pregnant</Text>
         </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          monthFormat={'MMMM yyyy'}
          markingType={'multi-dot'}
          markedDates={getMarkedDates()}
          onDayPress={handleDatePress}
          theme={{
            selectedDayBackgroundColor: '#e91e63',
            todayTextColor: '#e91e63',
            arrowColor: '#e91e63',
            monthTextColor: '#333',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
        />
        
        {/* Calendar Legend */}
        <View style={styles.calendarLegend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#e91e63' }]} />
              <Text style={styles.legendText}>Due Date</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.legendText}>Appointments</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Weight Logs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff9800' }]} />
              <Text style={styles.legendText}>BP Logs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9c27b0' }]} />
              <Text style={styles.legendText}>Milestones</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Today's Symptoms */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Symptoms</Text>
          <TouchableOpacity 
            style={styles.logSymptomButton}
            onPress={handleLogSymptom}
          >
            <Ionicons name="add-circle" size={20} color="#e91e63" />
            <Text style={styles.logSymptomButtonText}>Log Symptom</Text>
          </TouchableOpacity>
        </View>
        {pregnancySymptoms.length > 0 ? (
          <View style={styles.symptomsGrid}>
            {pregnancySymptoms.slice(0, 6).map((symptom) => (
              <View key={symptom.id} style={[styles.symptomCard, { backgroundColor: getSymptomCardColor(symptom.severity) }]}>
                <TouchableOpacity 
                  style={styles.symptomCardContent}
                  onPress={() => {
                    setSelectedSymptomDetail(symptom);
                    setShowSymptomDetailModal(true);
                  }}
                >
                  <Ionicons name="medical-outline" size={24} color="#e91e63" />
                  <Text style={styles.symptomName}>{symptom.symptom}</Text>
                  <Text style={styles.symptomSeverity}>{symptom.severity}</Text>
                </TouchableOpacity>
                <View style={styles.symptomActions}>
                  <TouchableOpacity 
                    onPress={() => handleEditSymptom(symptom)}
                    style={styles.symptomActionButton}
                  >
                    <Ionicons name="pencil" size={16} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => showDeleteConfirmation('symptom', symptom.id)}
                    style={styles.symptomActionButton}
                  >
                    <Ionicons name="trash" size={16} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No symptoms logged yet</Text>
            <Text style={styles.emptyStateSubtext}>Start tracking your symptoms</Text>
          </View>
        )}
      </View>

      {/* Quick Log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickLogContainer}>
          <TouchableOpacity style={styles.logButton} onPress={handleLogWeight}>
            <View style={styles.logButtonHeader}>
              <Ionicons name="scale" size={24} color="#4CAF50" />
              <InformationIcon 
                info="Track your weight gain throughout pregnancy to monitor healthy weight progression and identify any concerns early. Regular weight monitoring helps ensure you're gaining weight at a healthy rate for both you and your baby."
                size={16}
                color="#4CAF50"
                title="Log Weight"
              />
            </View>
            <Text style={styles.logButtonText}>Log Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logButton} onPress={handleLogBloodPressure}>
            <View style={styles.logButtonHeader}>
              <Ionicons name="heart" size={24} color="#e91e63" />
              <InformationIcon 
                info="Monitor your blood pressure regularly during pregnancy to detect preeclampsia or other complications early. High blood pressure during pregnancy can be dangerous for both mother and baby, so regular monitoring is crucial."
                size={16}
                color="#e91e63"
                title="Log Blood Pressure"
              />
            </View>
            <Text style={styles.logButtonText}>Log BP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logButton} onPress={handleAddAppointment}>
            <View style={styles.logButtonHeader}>
              <Ionicons name="calendar" size={24} color="#2196F3" />
              <InformationIcon 
                info="Schedule and track your prenatal appointments, ultrasounds, and other medical visits to stay on top of your care. Regular prenatal care is essential for monitoring your baby's development and your health throughout pregnancy."
                size={16}
                color="#2196F3"
                title="Add Appointment"
              />
            </View>
            <Text style={styles.logButtonText}>Add Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <View style={styles.appointmentsCard}>
          {appointments.slice(0, 3).map((appointment, index) => (
            <View key={appointment.id || index} style={styles.appointmentItem}>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
                <Text style={styles.appointmentDate}>{appointment.date} at {appointment.time}</Text>
                <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity 
                  onPress={() => handleEditAppointment(appointment)}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={18} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => showDeleteConfirmation('appointment', appointment.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Pregnancy Milestones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pregnancy Milestones</Text>
        <View style={styles.milestonesCard}>
          {milestones.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <View style={[
                styles.milestoneIcon,
                milestone.completed && styles.milestoneIconCompleted
              ]}>
                <Ionicons 
                  name={milestone.completed ? "checkmark" : "time-outline"} 
                  size={20} 
                  color={milestone.completed ? "#fff" : "#666"} 
                />
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestoneWeek}>Week {milestone.week}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Log History */}
      {(weightHistory.length > 0 || bpHistory.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          
          {weightHistory.length > 0 && (
            <View style={styles.historyCard}>
              <Text style={styles.historySubtitle}>Weight History</Text>
              {weightHistory.slice(0, 3).map((entry, index) => (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyValue}>{entry.weight} kg</Text>
                    <Text style={styles.historyDate}>{entry.date}</Text>
                  </View>
                  <View style={styles.historyActions}>
                    <TouchableOpacity 
                      onPress={() => handleEditWeight(entry)}
                      style={styles.editButton}
                    >
                      <Ionicons name="pencil" size={18} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => showDeleteConfirmation('weight', entry.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={18} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {bpHistory.length > 0 && (
            <View style={styles.historyCard}>
              <Text style={styles.historySubtitle}>Blood Pressure History</Text>
              {bpHistory.slice(0, 3).map((entry, index) => (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyValue}>{entry.systolic}/{entry.diastolic}</Text>
                    <Text style={styles.historyDate}>{entry.date}</Text>
                  </View>
                  <View style={styles.historyActions}>
                    <TouchableOpacity 
                      onPress={() => handleEditBP(entry)}
                      style={styles.editButton}
                    >
                      <Ionicons name="pencil" size={18} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => showDeleteConfirmation('bp', entry.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={18} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Due Date Input Modal */}
      <Modal
        visible={showDueDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDueDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Due Date</Text>
            <Text style={styles.modalSubtitle}>
              Select your expected due date from the calendar below
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Your Due Date</Text>
              <Calendar
                onDayPress={handleDueDateSelect}
                markedDates={{
                  [tempDueDate]: { selected: true, selectedColor: '#e91e63' }
                }}
                theme={{
                  selectedDayBackgroundColor: '#e91e63',
                  todayTextColor: '#e91e63',
                  arrowColor: '#e91e63',
                  monthTextColor: '#333',
                  textDayFontWeight: '500',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                  disabledTextColor: '#ccc',
                }}
                minDate={new Date().toISOString().split('T')[0]}
                maxDate={(() => {
                  const maxDate = new Date();
                  maxDate.setMonth(maxDate.getMonth() + 10);
                  return maxDate.toISOString().split('T')[0];
                })()}
                disableAllTouchEventsForDisabledDays={true}
              />
              {dateErrors.dueDate && (
                <Text style={styles.errorMessage}>{dateErrors.dueDate}</Text>
              )}
              <View style={styles.dateRangeNote}>
                <Ionicons name="information-circle-outline" size={16} color="#666" />
                <Text style={styles.dateRangeNoteText}>
                  Select a date within the next 10 months for a realistic pregnancy timeline
                </Text>
              </View>
              
              {tempDueDate && (
                <View style={styles.selectedDateContainer}>
                  <Ionicons name="calendar" size={16} color="#e91e63" />
                  <Text style={styles.selectedDateText}>
                    Selected: {new Date(tempDueDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowDueDateModal(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, saving && styles.disabledButton]} 
                onPress={handleSetDueDate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                <Text style={styles.confirmButtonText}>Set Due Date</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Weight Logging Modal */}
      <Modal
        visible={showWeightModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingWeight ? 'Edit Weight' : 'Log Weight'}</Text>
            <Text style={styles.modalSubtitle}>
              Enter your current weight to track your pregnancy progress
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowWeightDateCalendar(true)}
              >
                <Text style={[styles.datePickerText, !tempWeightDate && styles.datePickerPlaceholder]}>
                  {tempWeightDate ? (() => {
                    const date = new Date(tempWeightDate);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'Invalid date';
                  })() : 'Select date (defaults to today)'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.textInput}
                value={tempWeight}
                onChangeText={setTempWeight}
                placeholder="Enter weight in kg"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowWeightModal(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, saving && styles.disabledButton]} 
                onPress={handleSaveWeight}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                <Text style={styles.confirmButtonText}>{editingWeight ? 'Update Weight' : 'Save Weight'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Blood Pressure Logging Modal */}
      <Modal
        visible={showBPModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBPModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingBP ? 'Edit Blood Pressure' : 'Log Blood Pressure'}</Text>
            <Text style={styles.modalSubtitle}>
              Enter your current blood pressure readings
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowBPDateCalendar(true)}
              >
                <Text style={[styles.datePickerText, !tempBPDate && styles.datePickerPlaceholder]}>
                  {tempBPDate ? (() => {
                    const date = new Date(tempBPDate);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'Invalid date';
                  })() : 'Select date (defaults to today)'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.bpInputRow}>
                <View style={styles.bpInputContainer}>
                  <Text style={styles.inputLabel}>Systolic</Text>
                  <TextInput
                    style={styles.textInput}
                    value={tempSystolic}
                    onChangeText={setTempSystolic}
                    placeholder="120"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.bpSeparator}>/</Text>
                <View style={styles.bpInputContainer}>
                  <Text style={styles.inputLabel}>Diastolic</Text>
                  <TextInput
                    style={styles.textInput}
                    value={tempDiastolic}
                    onChangeText={setTempDiastolic}
                    placeholder="80"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowBPModal(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, saving && styles.disabledButton]} 
                onPress={handleSaveBloodPressure}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                <Text style={styles.confirmButtonText}>{editingBP ? 'Update BP' : 'Save BP'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Weight Date Calendar Modal */}
      <Modal
        visible={showWeightDateCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeightDateCalendar(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Weight Log Date</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowWeightDateCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleWeightDateSelect}
              markedDates={{
                [tempWeightDate]: { selected: true, selectedColor: '#e91e63' }
              }}
              theme={{
                selectedDayBackgroundColor: '#e91e63',
                todayTextColor: '#e91e63',
                arrowColor: '#e91e63',
                monthTextColor: '#333',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
              }}
              maxDate={new Date().toISOString().split('T')[0]}
            />
            {tempWeightDate && (
              <View style={styles.selectedDateContainer}>
                <Ionicons name="calendar" size={16} color="#e91e63" />
                <Text style={styles.selectedDateText}>
                  Selected: {(() => {
                    const date = new Date(tempWeightDate);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Invalid date';
                  })()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* BP Date Calendar Modal */}
      <Modal
        visible={showBPDateCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBPDateCalendar(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select BP Log Date</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowBPDateCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleBPDateSelect}
              markedDates={{
                [tempBPDate]: { selected: true, selectedColor: '#e91e63' }
              }}
              theme={{
                selectedDayBackgroundColor: '#e91e63',
                todayTextColor: '#e91e63',
                arrowColor: '#e91e63',
                monthTextColor: '#333',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
              }}
              maxDate={new Date().toISOString().split('T')[0]}
            />
            {tempBPDate && (
              <View style={styles.selectedDateContainer}>
                <Ionicons name="calendar" size={16} color="#e91e63" />
                <Text style={styles.selectedDateText}>
                  Selected: {(() => {
                    const date = new Date(tempBPDate);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Invalid date';
                  })()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Appointment Adding Modal */}
      <Modal
        visible={showAppointmentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAppointmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}</Text>
            <Text style={styles.modalSubtitle}>
              Schedule your next medical appointment
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Appointment Type</Text>
              <TextInput
                style={styles.textInput}
                value={tempAppointment.type}
                onChangeText={(text) => setTempAppointment(prev => ({...prev, type: text}))}
                placeholder="e.g., Ultrasound, Checkup, Blood Test"
                placeholderTextColor="#999"
              />
              
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={[styles.datePickerButton, dateErrors.appointmentDate && styles.errorInput]}
                onPress={() => setShowAppointmentDateCalendar(true)}
              >
                <Text style={[styles.datePickerText, !tempAppointment.date && styles.datePickerPlaceholder, dateErrors.appointmentDate && styles.errorText]}>
                  {tempAppointment.date ? (() => {
                    const date = new Date(tempAppointment.date);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'Invalid date';
                  })() : 'Select appointment date'
                  }
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
              {dateErrors.appointmentDate && (
                <Text style={styles.errorMessage}>{dateErrors.appointmentDate}</Text>
              )}
              
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.textInput}
                value={tempAppointment.time}
                onChangeText={(text) => setTempAppointment(prev => ({...prev, time: text}))}
                placeholder="e.g., 10:00 AM"
                placeholderTextColor="#999"
              />
              
              <Text style={styles.inputLabel}>Doctor</Text>
              <TextInput
                style={styles.textInput}
                value={tempAppointment.doctor}
                onChangeText={(text) => setTempAppointment(prev => ({...prev, doctor: text}))}
                placeholder="Doctor's name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAppointmentModal(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, saving && styles.disabledButton]} 
                onPress={handleSaveAppointment}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                <Text style={styles.confirmButtonText}>{editingAppointment ? 'Update Appointment' : 'Add Appointment'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Appointment Calendar Modal */}
      <Modal
        visible={showAppointmentCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAppointmentCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Appointment Date</Text>
            <Text style={styles.modalSubtitle}>
              Choose the date for your appointment
            </Text>
            
            <View style={styles.inputContainer}>
              <Calendar
                onDayPress={handleAppointmentDateSelect}
                markedDates={{
                  [tempAppointment.date]: { selected: true, selectedColor: '#e91e63' }
                }}
                theme={{
                  selectedDayBackgroundColor: '#e91e63',
                  todayTextColor: '#e91e63',
                  arrowColor: '#e91e63',
                  monthTextColor: '#333',
                  textDayFontWeight: '500',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                }}
                minDate={new Date().toISOString().split('T')[0]}
                maxDate={(() => {
                  const maxDate = new Date();
                  maxDate.setFullYear(maxDate.getFullYear() + 1);
                  return maxDate.toISOString().split('T')[0];
                })()}
              />
              
              {tempAppointment.date && (
                <View style={styles.selectedDateContainer}>
                  <Ionicons name="calendar" size={16} color="#e91e63" />
                  <Text style={styles.selectedDateText}>
                    Selected: {(() => {
                      const date = new Date(tempAppointment.date);
                      return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                      }) : 'Invalid date';
                    })()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAppointmentCalendar(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={() => setShowAppointmentCalendar(false)}
              >
                <Text style={styles.confirmButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Details Modal */}
      <Modal
        visible={showDateDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedCalendarDate ? new Date(selectedCalendarDate.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : ''}
            </Text>
            
            {selectedCalendarDate && (
              <ScrollView style={styles.dateDetailsContent}>
                {/* Appointments */}
                {selectedCalendarDate.appointments.length > 0 && (
                  <View style={styles.dateDetailsSection}>
                    <Text style={styles.dateDetailsSectionTitle}>
                      <Ionicons name="calendar" size={16} color="#2196F3" /> Appointments
                    </Text>
                    {selectedCalendarDate.appointments.map((appointment, index) => (
                      <View key={index} style={styles.dateDetailsItem}>
                        <Text style={styles.dateDetailsItemTitle}>{appointment.type}</Text>
                        <Text style={styles.dateDetailsItemSubtitle}>
                          {appointment.time} with {appointment.doctor}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Weight Logs */}
                {selectedCalendarDate.weightLogs.length > 0 && (
                  <View style={styles.dateDetailsSection}>
                    <Text style={styles.dateDetailsSectionTitle}>
                      <Ionicons name="scale" size={16} color="#4CAF50" /> Weight Logs
                    </Text>
                    {selectedCalendarDate.weightLogs.map((log, index) => (
                      <View key={index} style={styles.dateDetailsItem}>
                        <Text style={styles.dateDetailsItemTitle}>{log.weight} kg</Text>
                        <Text style={styles.dateDetailsItemSubtitle}>
                          Logged at {new Date(log.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Blood Pressure Logs */}
                {selectedCalendarDate.bpLogs.length > 0 && (
                  <View style={styles.dateDetailsSection}>
                    <Text style={styles.dateDetailsSectionTitle}>
                      <Ionicons name="heart" size={16} color="#e91e63" /> Blood Pressure
                    </Text>
                    {selectedCalendarDate.bpLogs.map((log, index) => (
                      <View key={index} style={styles.dateDetailsItem}>
                        <Text style={styles.dateDetailsItemTitle}>{log.systolic}/{log.diastolic}</Text>
                        <Text style={styles.dateDetailsItemSubtitle}>
                          Logged at {new Date(log.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Milestones */}
                {selectedCalendarDate.milestones.length > 0 && (
                  <View style={styles.dateDetailsSection}>
                    <Text style={styles.dateDetailsSectionTitle}>
                      <Ionicons name="trophy" size={16} color="#9c27b0" /> Milestones
                    </Text>
                    {selectedCalendarDate.milestones.map((milestone, index) => (
                      <View key={index} style={styles.dateDetailsItem}>
                        <Text style={styles.dateDetailsItemTitle}>{milestone.title}</Text>
                        <Text style={styles.dateDetailsItemSubtitle}>
                          Week {milestone.week} - Completed
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* No data message */}
                {selectedCalendarDate.appointments.length === 0 && 
                 selectedCalendarDate.weightLogs.length === 0 && 
                 selectedCalendarDate.bpLogs.length === 0 && 
                 selectedCalendarDate.milestones.length === 0 && (
                  <View style={styles.noDataContainer}>
                    <Ionicons name="calendar-outline" size={48} color="#ccc" />
                    <Text style={styles.noDataText}>No data for this date</Text>
                    <Text style={styles.noDataSubtext}>
                      Tap the quick log buttons to add information
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={() => setShowDateDetailsModal(false)}
              >
                <Text style={styles.confirmButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Appointment Date Calendar Modal */}
      <Modal
        visible={showAppointmentDateCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAppointmentDateCalendar(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Appointment Date</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowAppointmentDateCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleAppointmentDateSelect}
              markedDates={{
                [tempAppointment.date]: { selected: true, selectedColor: '#e91e63' }
              }}
              theme={{
                selectedDayBackgroundColor: '#e91e63',
                todayTextColor: '#e91e63',
                arrowColor: '#e91e63',
                monthTextColor: '#333',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
              }}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </View>
        </View>
      </Modal>

      {/* Symptom Log Modal */}
      <Modal
        visible={showSymptomModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSymptomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingSymptom ? 'Edit Symptom' : 'Log Symptom'}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Symptom</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowSymptomDropdown(true)}
              >
                <Text style={[styles.dropdownText, !newSymptom && styles.dropdownPlaceholder]}>
                  {newSymptom || 'Select a symptom'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Severity</Text>
              <View style={styles.severityButtons}>
                {['Light', 'Moderate', 'Severe'].map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.severityButton,
                      symptomSeverity === severity && styles.activeSeverityButton
                    ]}
                    onPress={() => setSymptomSeverity(severity)}
                  >
                    <Text style={[
                      styles.severityButtonText,
                      symptomSeverity === severity && styles.activeSeverityButtonText
                    ]}>
                      {severity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSymptomModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, saving && styles.disabledButton]}
                onPress={savePregnancySymptomData}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>{editingSymptom ? 'Update' : 'Save'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Symptom Dropdown Modal */}
      <Modal
        visible={showSymptomDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSymptomDropdown(false)}
      >
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowSymptomDropdown(false)}
          />
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Symptom</Text>
              <TouchableOpacity 
                onPress={() => setShowSymptomDropdown(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownList}>
              {pregnancySymptomOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setNewSymptom(option);
                    setShowSymptomDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                  {newSymptom === option && (
                    <Ionicons name="checkmark" size={20} color="#e91e63" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Symptom Detail Modal */}
      <Modal
        visible={showSymptomDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSymptomDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.detailModalHeader}>
              <Text style={styles.modalTitle}>
                {selectedSymptomDetail?.symptom || 'Symptom Details'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowSymptomDetailModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedSymptomDetail && (
              <View style={styles.detailContent}>
                <View style={styles.severityBadge}>
                  <Text style={styles.severityBadgeText}>
                    Severity: {selectedSymptomDetail.severity}
                  </Text>
                </View>
                
                <View style={styles.contentSection}>
                  <Text style={styles.contentTitle}>Recommendations:</Text>
                  <View style={[
                    styles.contentBox,
                    selectedSymptomDetail.severity === 'Severe' && styles.severeContentBox
                  ]}>
                    <Text style={[
                      styles.contentText,
                      selectedSymptomDetail.severity === 'Severe' && styles.severeContentText
                    ]}>
                      {getPregnancySymptomContent(selectedSymptomDetail.symptom, selectedSymptomDetail.severity)}
                    </Text>
                  </View>
                  
                  {selectedSymptomDetail.severity === 'Severe' && (
                    <View style={styles.alertBox}>
                      <Ionicons name="warning" size={24} color="#F44336" />
                      <Text style={styles.alertText}>Please consult a doctor immediately</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.detailModalButtons}>
              <TouchableOpacity 
                style={[styles.detailModalButton, styles.editDetailButton]}
                onPress={() => {
                  handleEditSymptom(selectedSymptomDetail);
                }}
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <Text style={styles.detailModalButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.detailModalButton, styles.deleteDetailButton]}
                onPress={() => {
                  setShowSymptomDetailModal(false);
                  showDeleteConfirmation('symptom', selectedSymptomDetail.id);
                }}
              >
                <Ionicons name="trash" size={18} color="#fff" />
                <Text style={styles.detailModalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.detailModalButton, styles.closeDetailButton]}
                onPress={() => setShowSymptomDetailModal(false)}
              >
                <Text style={styles.closeDetailButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalHeader}>
              <Ionicons name="warning" size={32} color="#F44336" />
              <Text style={styles.confirmModalTitle}>
                {deleteItemType === 'weight' && 'Delete Weight Entry'}
                {deleteItemType === 'bp' && 'Delete Blood Pressure Entry'}
                {deleteItemType === 'symptom' && 'Delete Symptom'}
                {deleteItemType === 'appointment' && 'Delete Appointment'}
              </Text>
            </View>
            <Text style={styles.confirmModalMessage}>
              Are you sure you want to delete this {deleteItemType === 'weight' ? 'weight entry' : deleteItemType === 'bp' ? 'blood pressure entry' : deleteItemType === 'symptom' ? 'symptom' : 'appointment'}? This action cannot be undone.
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmCancelButton, saving && styles.disabledButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteItemType(null);
                  setDeleteItemId(null);
                }}
                disabled={saving}
              >
                <Text style={styles.confirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmDeleteButton, saving && styles.disabledButton]}
                onPress={confirmDelete}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                  </>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  symptomCardContent: {
    flex: 1,
    alignItems: 'center',
  },
  symptomActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 4,
    right: 4,
    gap: 4,
  },
  symptomActionButton: {
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
  },
  symptomCardLogged: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  symptomName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  symptomSeverity: {
    fontSize: 12,
    color: '#666',
  },
  quickLogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  logButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  logButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  appointmentsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  appointmentDoctor: {
    fontSize: 12,
    color: '#999',
  },
  milestonesCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneIconCompleted: {
    backgroundColor: '#4CAF50',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  milestoneWeek: {
    fontSize: 14,
    color: '#666',
  },
  setupButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 12,
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '95%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fce4ec',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '500',
    marginLeft: 8,
  },
  dateRangeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  dateRangeNoteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#e91e63',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  bpInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bpInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  bpSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
  },
  historySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyInfo: {
    flex: 1,
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  calendarLegend: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    width: '48%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  dateDetailsContent: {
    maxHeight: 300,
    marginBottom: 16,
  },
  dateDetailsSection: {
    marginBottom: 16,
  },
  dateDetailsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDetailsItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateDetailsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  dateDetailsItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  datePickerPlaceholder: {
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorInput: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
  },
  errorMessage: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarCloseButton: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logSymptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logSymptomButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e91e63',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  activeSeverityButton: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  severityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeSeverityButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailContent: {
    marginBottom: 20,
  },
  severityBadge: {
    backgroundColor: '#fce4ec',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  severityBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e91e63',
  },
  contentSection: {
    marginTop: 8,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  contentBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  severeContentBox: {
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  severeContentText: {
    color: '#d32f2f',
    fontWeight: '500',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 12,
    flex: 1,
  },
  closeDetailButton: {
    backgroundColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeDetailButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  detailModalButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  detailModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  editDetailButton: {
    backgroundColor: '#2196F3',
  },
  deleteDetailButton: {
    backgroundColor: '#f44336',
  },
  detailModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  confirmModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  confirmModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  confirmCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

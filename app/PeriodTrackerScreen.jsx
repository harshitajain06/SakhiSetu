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
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../config/firebase';
import { useTranslation } from '../contexts/TranslationContext';

export default function PeriodTrackerScreen() {
  const { t } = useTranslation();
  
  // Helper function to get translation with fallback
  // If translation returns the key itself, use the fallback
  const getTranslation = (key, fallback) => {
    const translation = t(key);
    // If translation is the same as key, it means translation wasn't found
    return translation === key ? fallback : (translation || fallback);
  };
  
  const [menstrualData, setMenstrualData] = useState({
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: null,
    isSetup: false
  });
  const [periodHistory, setPeriodHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodStartDate, setPeriodStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodEndDate, setPeriodEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSymptom, setNewSymptom] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('Light'); // Will be translated in UI
  const [dateErrors, setDateErrors] = useState({});
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [showSymptomDetailModal, setShowSymptomDetailModal] = useState(false);
  const [selectedSymptomDetail, setSelectedSymptomDetail] = useState(null);
  const [showEditPeriodModal, setShowEditPeriodModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [dateToPeriodMap, setDateToPeriodMap] = useState({});
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showSymptomDeleteConfirmModal, setShowSymptomDeleteConfirmModal] = useState(false);
  const [selectedSymptomToDelete, setSelectedSymptomToDelete] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '', type: 'success' });

  // Symptom options
  const symptomOptions = [
    t('periodTracker.cramps'),
    t('periodTracker.bloating'),
    t('periodTracker.headache'),
    t('periodTracker.fatigue'),
    t('periodTracker.vomitNausea'),
    t('periodTracker.digestiveIssues'),
    t('periodTracker.moodSwings')
  ];

  // Get translated severity text
  const getSeverityText = (severity) => {
    switch (severity) {
      case 'Severe':
        return t('periodTracker.severe');
      case 'Moderate':
        return t('periodTracker.moderate');
      case 'Light':
        return t('periodTracker.light');
      default:
        return severity;
    }
  };

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

  // Symptom content based on type and severity
  const getSymptomContent = (symptomType, severity) => {
    const content = {
      'Cramps': {
        'Light': 'Apply a heating pad or hot water bottle to your lower abdomen or back to soothe muscles. Taking a warm bath can also offer relief.',
        'Moderate': 'Take an over-the-counter nonsteroidal anti-inflammatory drug (NSAID), such as ibuprofen (Advil) or naproxen (Aleve). Start taking it at the first sign of pain.',
        'Severe': 'RED ALERT TO CONSULT A DOCTOR'
      },
      'Bloating': {
        'Light': 'Stay hydrated by drinking plenty of water to help flush out excess fluid. Gentle exercise like walking can also help.',
        'Moderate': 'Reduce your intake of salty, sugary, and processed foods. You can also try natural diuretics like ginger or asparagus.',
        'Severe': 'In addition to lifestyle changes, a doctor can help determine if an underlying issue is causing severe fluid retention. Some natural remedies, like magnesium, may also help. RED ALERT TO CONSULT A DOCTOR'
      },
      'Headache': {
        'Light': 'Drink water, eat a light meal if you\'re hungry, and relax in a dark, quiet room.',
        'Moderate': 'Use common over-the-counter pain relievers like ibuprofen or acetaminophen. A cold pack on your head or neck can also help.',
        'Severe': 'For severe headaches or menstrual migraines, a doctor may need to prescribe specific medication. Some find relief from supplements like magnesium. RED ALERT TO CONSULT A DOCTOR'
      },
      'Fatigue': {
        'Light': 'Prioritize sleep and maintain a consistent sleep schedule. Eat nutritious foods throughout the day to avoid energy crashes.',
        'Moderate': 'Gentle, regular exercise such as yoga or walking can boost energy and improve sleep quality. Avoid excessive caffeine and alcohol.',
        'Severe': 'A doctor should evaluate severe fatigue, especially if you also experience heavy bleeding, as it could be a sign of iron deficiency (anemia). RED ALERT TO CONSULT A DOCTOR'
      },
      'Vomit/Nausea': {
        'Light': 'Drink ginger or peppermint tea. Eat small, bland meals like pulses, bananas, or toast.',
        'Moderate': 'Use heat therapy, like a heating pad on your abdomen, which can help relax muscles and ease nausea caused by cramps. Stay hydrated with small, frequent sips of water.',
        'Severe': 'For persistent or severe nausea, a doctor might recommend anti-nausea medication. In any case, staying hydrated is crucial. RED ALERT TO CONSULT A DOCTOR'
      },
      'Digestive issues': {
        'Light': 'Drink plenty of water and eat fiber-rich foods like fruits and vegetables. Avoid carbonated drinks and salty foods.',
        'Moderate': 'For diarrhea, focus on soluble fiber found in foods like bananas, oats, and peeled apples. For constipation, ensure you are drinking plenty of warm water and getting gentle exercise.',
        'Severe': 'If persistent or painful, digestive issues could point to an underlying condition like endometriosis, and a doctor should be consulted. RED ALERT TO CONSULT A DOCTOR'
      },
      'Mood swings': {
        'Light': 'Practice relaxation techniques like deep breathing, yoga, or meditation. Limit your intake of caffeine and sugar.',
        'Moderate': 'Regular exercise is proven to help improve mood by releasing endorphins. Eating a balanced diet with plenty of fruits, vegetables, and whole grains can help stabilize your blood sugar.',
        'Severe': 'If mood swings are severely impacting your daily life, a doctor may recommend counseling, specific supplements like calcium, or medication. RED ALERT TO CONSULT A DOCTOR'
      }
    };

    return content[symptomType]?.[severity] || 'No information available.';
  };

  // Get current user ID
  const getCurrentUserId = () => {
    return auth.currentUser?.uid;
  };

  // Fetch menstrual data
  const fetchMenstrualData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.menstrualData) {
          setMenstrualData(userData.menstrualData);
        }
      }
    } catch (error) {
      console.error('Error fetching menstrual data:', error);
    }
  };

  // Fetch period history
  const fetchPeriodHistory = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const periodCollectionRef = collection(db, 'users', userId, 'periodHistory');
      const q = query(periodCollectionRef, orderBy('startDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const periodData = [];
      querySnapshot.forEach((doc) => {
        periodData.push({ id: doc.id, ...doc.data() });
      });
      
      setPeriodHistory(periodData);
      updateMarkedDates(periodData);
    } catch (error) {
      console.error('Error fetching period history:', error);
    }
  };

  // Fetch symptoms
  const fetchSymptoms = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const symptomsCollectionRef = collection(db, 'users', userId, 'symptoms');
      const q = query(symptomsCollectionRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const symptomsData = [];
      querySnapshot.forEach((doc) => {
        symptomsData.push({ id: doc.id, ...doc.data() });
      });
      
      setSymptoms(symptomsData);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  // Update marked dates for calendar
  const updateMarkedDates = (periods) => {
    const marked = {};
    const dateMap = {};
    
    periods.forEach(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      
      // Validate dates before using them
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        marked[dateStr] = { 
          selected: true, 
          selectedColor: '#e91e63',
          selectedTextColor: '#fff'
        };
        // Map each date to its period for easy lookup
        dateMap[dateStr] = period;
      }
    });

    // Add predicted next period
    if (menstrualData.lastPeriod) {
      const lastPeriodDate = new Date(menstrualData.lastPeriod);
      // Validate date before using it
      if (!isNaN(lastPeriodDate.getTime())) {
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + menstrualData.cycleLength);
        
        const nextPeriodStr = nextPeriodDate.toISOString().split('T')[0];
        marked[nextPeriodStr] = { 
          marked: true, 
          dotColor: '#e91e63' 
        };
      }
    }
    
    setMarkedDates(marked);
    setDateToPeriodMap(dateMap);
  };

  // Calculate next period date
  const calculateNextPeriod = () => {
    if (!menstrualData.lastPeriod) return null;
    
    const lastPeriodDate = new Date(menstrualData.lastPeriod);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + menstrualData.cycleLength);
    
    return nextPeriodDate;
  };

  // Save period data
  const savePeriodData = async () => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      // Validate dates
      if (!validateDates()) {
        setMessageModalContent({
          title: t('periodTracker.validationError') || 'Validation Error',
          message: t('periodTracker.fixDateErrors') || 'Please fix the date errors',
          type: 'error'
        });
        setShowMessageModal(true);
        setSaving(false);
        return;
      }

      const periodData = {
        startDate: periodStartDate,
        endDate: periodEndDate,
        periodLength: Math.ceil((new Date(periodEndDate) - new Date(periodStartDate)) / (1000 * 60 * 60 * 24)) + 1,
        cycleLength: menstrualData.cycleLength,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'users', userId, 'periodHistory'), periodData);

      // Update or create user's menstrual data
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, {
          'menstrualData.lastPeriod': periodStartDate,
          'menstrualData.isSetup': true
        });
      } else {
        // Create new document with menstrual data
        await setDoc(userDocRef, {
          menstrualData: {
            cycleLength: menstrualData.cycleLength,
            periodLength: menstrualData.periodLength,
            lastPeriod: periodStartDate,
            isSetup: true
          }
        });
      }

      // Refresh data
      await fetchMenstrualData();
      await fetchPeriodHistory();
      
      setShowPeriodModal(false);
      // Reset form
      setPeriodStartDate(new Date().toISOString().split('T')[0]);
      setPeriodEndDate(new Date().toISOString().split('T')[0]);
      
      // Show success message
      setMessageModalContent({
        title: t('common.success') || 'Success',
        message: t('periodTracker.successPeriodLogged') || 'Period logged successfully',
        type: 'success'
      });
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error saving period data:', error);
      setMessageModalContent({
        title: t('common.error') || 'Error',
        message: t('periodTracker.errorSavePeriod') || 'Error saving period',
        type: 'error'
      });
      setShowMessageModal(true);
    } finally {
      setSaving(false);
    }
  };

  // Reset modal state when opening
  const openPeriodModal = () => {
    setPeriodStartDate(new Date().toISOString().split('T')[0]);
    setPeriodEndDate(new Date().toISOString().split('T')[0]);
    setDateErrors({});
    setSelectedPeriod(null);
    setShowPeriodModal(true);
  };

  // Validate dates
  const validateDates = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(periodStartDate);
    const endDate = new Date(periodEndDate);
    const todayDate = new Date(today);

    // Check if start date is provided
    if (!periodStartDate) {
      errors.startDate = t('periodTracker.startDateRequired');
    } else if (isNaN(startDate.getTime())) {
      errors.startDate = t('periodTracker.invalidStartDate');
    } else if (startDate > todayDate) {
      errors.startDate = t('periodTracker.startDateFuture');
    }

    // Check if end date is provided
    if (!periodEndDate) {
      errors.endDate = t('periodTracker.endDateRequired');
    } else if (isNaN(endDate.getTime())) {
      errors.endDate = t('periodTracker.invalidEndDate');
    } else if (endDate > todayDate) {
      errors.endDate = t('periodTracker.endDateFuture');
    }

    // Check if end date is after start date
    if (periodStartDate && periodEndDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (endDate < startDate) {
        errors.endDate = t('periodTracker.endBeforeStart');
      }
      
      // Check if period is too long (more than 10 days)
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 10) {
        errors.endDate = t('periodTracker.periodTooLong');
      }
    }

    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle date selection from calendar
  const handleStartDateSelect = (day) => {
    // Toggle selection: if the same date is clicked, deselect it
    if (periodStartDate === day.dateString) {
      setPeriodStartDate('');
    } else {
      setPeriodStartDate(day.dateString);
    }
    setShowStartCalendar(false);
    // Clear start date error when user selects a date
    if (dateErrors.startDate) {
      setDateErrors(prev => ({ ...prev, startDate: null }));
    }
  };

  const handleEndDateSelect = (day) => {
    // Toggle selection: if the same date is clicked, deselect it
    if (periodEndDate === day.dateString) {
      setPeriodEndDate('');
    } else {
      setPeriodEndDate(day.dateString);
    }
    setShowEndCalendar(false);
    // Clear end date error when user selects a date
    if (dateErrors.endDate) {
      setDateErrors(prev => ({ ...prev, endDate: null }));
    }
  };

  // Clear date handlers
  const clearStartDate = () => {
    setPeriodStartDate('');
    if (dateErrors.startDate) {
      setDateErrors(prev => ({ ...prev, startDate: null }));
    }
  };

  const clearEndDate = () => {
    setPeriodEndDate('');
    if (dateErrors.endDate) {
      setDateErrors(prev => ({ ...prev, endDate: null }));
    }
  };

  // Handle date click on main calendar
  const handleCalendarDayPress = (day) => {
    const clickedDate = day.dateString;
    const period = dateToPeriodMap[clickedDate];
    
    if (period) {
      // If the date belongs to a period, show edit modal
      setSelectedPeriod(period);
      setPeriodStartDate(period.startDate);
      setPeriodEndDate(period.endDate);
      setDateErrors({});
      setShowEditPeriodModal(true);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = () => {
    if (!selectedPeriod) return;
    setShowDeleteConfirmModal(true);
  };

  // Delete period (called after confirmation)
  const confirmDeletePeriod = async () => {
    if (!selectedPeriod) return;
    
    // Store period info before async operations
    const periodToDelete = selectedPeriod;
    
    try {
      setSaving(true);
      setShowDeleteConfirmModal(false);
      const userId = getCurrentUserId();
      if (!userId) {
        setSaving(false);
        return;
      }

      // Delete the period from Firestore
      const periodDocRef = doc(db, 'users', userId, 'periodHistory', periodToDelete.id);
      await deleteDoc(periodDocRef);

      // Immediately update local state to remove the period from UI
      const updatedHistory = periodHistory.filter(p => p.id !== periodToDelete.id);
      setPeriodHistory(updatedHistory);
      updateMarkedDates(updatedHistory);

      // Close edit modal
      setShowEditPeriodModal(false);
      setSelectedPeriod(null);

      // Refresh data from server to ensure consistency
      await fetchMenstrualData();
      await fetchPeriodHistory();
      
      // Show success message
      setMessageModalContent({
        title: t('common.success') || 'Success',
        message: t('periodTracker.periodDeleted') || 'Period deleted successfully',
        type: 'success'
      });
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error deleting period:', error);
      // Refresh data even on error to ensure UI is in sync
      await fetchPeriodHistory();
      setMessageModalContent({
        title: t('common.error') || 'Error',
        message: t('periodTracker.errorDeletePeriod') || 'Error deleting period',
        type: 'error'
      });
      setShowMessageModal(true);
    } finally {
      setSaving(false);
    }
  };

  // Update period
  const updatePeriod = async () => {
    if (!selectedPeriod) return;

    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      // Validate dates
      if (!validateDates()) {
        setMessageModalContent({
          title: t('periodTracker.validationError') || 'Validation Error',
          message: t('periodTracker.fixDateErrors') || 'Please fix the date errors',
          type: 'error'
        });
        setShowMessageModal(true);
        setSaving(false);
        return;
      }

      const periodData = {
        startDate: periodStartDate,
        endDate: periodEndDate,
        periodLength: Math.ceil((new Date(periodEndDate) - new Date(periodStartDate)) / (1000 * 60 * 60 * 24)) + 1,
        cycleLength: menstrualData.cycleLength,
        createdAt: selectedPeriod.createdAt || new Date()
      };

      const periodDocRef = doc(db, 'users', userId, 'periodHistory', selectedPeriod.id);
      await updateDoc(periodDocRef, periodData);

      // Update lastPeriod if this was the most recent period
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.menstrualData?.lastPeriod === selectedPeriod.startDate) {
          await updateDoc(userDocRef, {
            'menstrualData.lastPeriod': periodStartDate
          });
        }
      }

      // Refresh data
      await fetchMenstrualData();
      await fetchPeriodHistory();
      
      setShowEditPeriodModal(false);
      setSelectedPeriod(null);
      
      // Show success message
      setMessageModalContent({
        title: t('common.success') || 'Success',
        message: t('periodTracker.periodUpdated') || 'Period updated successfully',
        type: 'success'
      });
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error updating period:', error);
      setMessageModalContent({
        title: t('common.error') || 'Error',
        message: t('periodTracker.errorUpdatePeriod') || 'Error updating period',
        type: 'error'
      });
      setShowMessageModal(true);
    } finally {
      setSaving(false);
    }
  };

  // Save symptom data
  const saveSymptomData = async () => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      if (!newSymptom) {
        setMessageModalContent({
          title: t('common.error') || 'Error',
          message: t('periodTracker.errorSelectSymptom') || 'Please select a symptom',
          type: 'error'
        });
        setShowMessageModal(true);
        setSaving(false);
        return;
      }

      // Check if a symptom with the same type and date already exists
      const symptomsCollectionRef = collection(db, 'users', userId, 'symptoms');
      const querySnapshot = await getDocs(symptomsCollectionRef);
      
      let existingSymptomId = null;
      let existingCreatedAt = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.symptom === newSymptom && data.date === selectedDate) {
          existingSymptomId = doc.id;
          existingCreatedAt = data.createdAt || null;
        }
      });

      const symptomData = {
        symptom: newSymptom,
        severity: symptomSeverity,
        date: selectedDate,
        createdAt: existingCreatedAt || new Date(),
        updatedAt: new Date()
      };

      if (existingSymptomId) {
        // Update existing symptom
        const symptomDocRef = doc(db, 'users', userId, 'symptoms', existingSymptomId);
        await updateDoc(symptomDocRef, symptomData);
      } else {
        // Create new symptom
        await addDoc(symptomsCollectionRef, symptomData);
      }

      // Refresh data
      await fetchSymptoms();
      
      setShowSymptomModal(false);
      setNewSymptom('');
      setSymptomSeverity('Light');
      
      // Show success message
      setMessageModalContent({
        title: t('common.success') || 'Success',
        message: existingSymptomId 
          ? (t('periodTracker.symptomUpdated') || 'Symptom updated successfully')
          : (t('periodTracker.successSymptomLogged') || 'Symptom logged successfully'),
        type: 'success'
      });
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error saving symptom data:', error);
      setMessageModalContent({
        title: t('common.error') || 'Error',
        message: t('periodTracker.errorSaveSymptom') || 'Error saving symptom',
        type: 'error'
      });
      setShowMessageModal(true);
    } finally {
      setSaving(false);
    }
  };

  // Show delete confirmation for symptom
  const showDeleteSymptomConfirmation = (symptom) => {
    setSelectedSymptomToDelete(symptom);
    setShowSymptomDeleteConfirmModal(true);
  };

  // Delete symptom (called after confirmation)
  const confirmDeleteSymptom = async () => {
    if (!selectedSymptomToDelete) return;
    
    const symptomToDelete = selectedSymptomToDelete;
    
    try {
      setSaving(true);
      setShowSymptomDeleteConfirmModal(false);
      const userId = getCurrentUserId();
      if (!userId) {
        setSaving(false);
        return;
      }

      // Delete the symptom from Firestore
      const symptomDocRef = doc(db, 'users', userId, 'symptoms', symptomToDelete.id);
      await deleteDoc(symptomDocRef);

      // Immediately update local state to remove the symptom from UI
      const updatedSymptoms = symptoms.filter(s => s.id !== symptomToDelete.id);
      setSymptoms(updatedSymptoms);

      // Refresh data from server to ensure consistency
      await fetchSymptoms();
      
      // Show success message
      setMessageModalContent({
        title: t('common.success') || 'Success',
        message: t('periodTracker.symptomDeleted') || 'Symptom deleted successfully',
        type: 'success'
      });
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error deleting symptom:', error);
      // Refresh data even on error to ensure UI is in sync
      await fetchSymptoms();
      setMessageModalContent({
        title: t('common.error') || 'Error',
        message: t('periodTracker.errorDeleteSymptom') || 'Error deleting symptom',
        type: 'error'
      });
      setShowMessageModal(true);
    } finally {
      setSaving(false);
      setSelectedSymptomToDelete(null);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMenstrualData(),
        fetchPeriodHistory(),
        fetchSymptoms()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Update marked dates when period history changes
  useEffect(() => {
    updateMarkedDates(periodHistory);
  }, [periodHistory, menstrualData]);

  const nextPeriod = calculateNextPeriod();
  const daysUntilNextPeriod = nextPeriod ? Math.ceil((nextPeriod - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  // Show loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>{t('periodTracker.loadingData')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('periodTracker.periodTracker')}</Text>
        <View style={styles.headerRight}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Current Status */}
      {menstrualData.isSetup ? (
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name="calendar" size={24} color="#e91e63" />
          <Text style={styles.statusTitle}>{t('periodTracker.nextPeriod')}</Text>
        </View>
          <Text style={styles.statusText}>
            {nextPeriod ? nextPeriod.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }) : t('periodTracker.notPredicted')}
          </Text>
          <Text style={styles.statusSubtext}>
            {daysUntilNextPeriod > 0 
              ? t('periodTracker.inDays', { days: daysUntilNextPeriod })
              : daysUntilNextPeriod === 0 
                ? t('periodTracker.today')
                : t('periodTracker.overdue')
            }
          </Text>
        </View>
      ) : (
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <Ionicons name="calendar" size={24} color="#e91e63" />
            <Text style={styles.setupTitle}>{t('periodTracker.setupTitle')}</Text>
          </View>
          <Text style={styles.setupText}>
            {t('periodTracker.setupText')}
          </Text>
          <TouchableOpacity 
            style={styles.setupButton} 
            onPress={openPeriodModal}
          >
            <Text style={styles.setupButtonText}>{t('periodTracker.logFirstPeriod')}</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
      </View>
      )}

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          monthFormat={'MMMM yyyy'}
          markedDates={markedDates}
          onDayPress={handleCalendarDayPress}
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
      </View>

      {/* Recent Symptoms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('periodTracker.recentSymptoms')}</Text>
        {symptoms.length > 0 ? (
        <View style={styles.symptomsGrid}>
            {symptoms.slice(0, 4).map((symptom, index) => {
              const symptomDate = symptom.date ? new Date(symptom.date) : null;
              const isValidDate = symptomDate && !isNaN(symptomDate.getTime());
              const formattedDate = isValidDate 
                ? symptomDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : symptom.date || 'Unknown date';
              
              return (
                <View 
                  key={symptom.id} 
                  style={[styles.symptomCard, { backgroundColor: getSymptomCardColor(symptom.severity) }]}
                >
                  <TouchableOpacity 
                    style={styles.symptomDeleteButton}
                    onPress={() => showDeleteSymptomConfirmation(symptom)}
                  >
                    <Ionicons name="close-circle" size={20} color="#F44336" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.symptomCardContent}
                    onPress={() => {
                      setSelectedSymptomDetail(symptom);
                      setShowSymptomDetailModal(true);
                    }}
                  >
                    <Ionicons name="medical-outline" size={24} color="#e91e63" />
                    <Text style={styles.symptomName}>{symptom.symptom}</Text>
                    <Text style={styles.symptomSeverity}>{getSeverityText(symptom.severity)}</Text>
                    <Text style={styles.symptomDate}>{formattedDate}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>{t('periodTracker.noSymptomsLogged')}</Text>
            <Text style={styles.emptyStateSubtext}>{t('periodTracker.startTrackingSymptoms')}</Text>
          </View>
        )}
      </View>

      {/* Quick Log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('periodTracker.quickLog')}</Text>
        <View style={styles.quickLogContainer}>
          <TouchableOpacity 
            style={styles.logButton}
            onPress={openPeriodModal}
          >
            <Ionicons name="add-circle" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>{getTranslation('periodTracker.recordMyPeriod', 'Record My Period')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logButton}
            onPress={() => setShowSymptomModal(true)}
          >
            <Ionicons name="medical" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>{getTranslation('periodTracker.recordMySymptoms', 'Record My Symptoms')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cycle History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('periodTracker.recentCycles')}</Text>
        {periodHistory.length > 0 ? (
        <View style={styles.historyCard}>
            {periodHistory.slice(0, 3).map((period) => {
              const startDate = new Date(period.startDate);
              const isValidDate = !isNaN(startDate.getTime());
              
              return (
                <View key={period.id} style={styles.historyItem}>
                  <Text style={styles.historyMonth}>
                    {isValidDate ? startDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Unknown Month'}
                  </Text>
                  <Text style={styles.historyDays}>
                    {period.periodLength ? `${period.periodLength} ${t('insights.days')}` : 'Unknown duration'}
                  </Text>
                  <Text style={styles.historyStatus}>
                    {period.cycleLength && period.cycleLength >= 21 && period.cycleLength <= 35 ? t('periodTracker.regular') : t('periodTracker.irregular')}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>{t('periodTracker.noCycleHistory')}</Text>
            <Text style={styles.emptyStateSubtext}>{t('periodTracker.startLoggingPeriods')}</Text>
          </View>
        )}
      </View>

      {/* Period Log Modal */}
      <Modal
        visible={showPeriodModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('periodTracker.logPeriodModal')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('periodTracker.startDate')}</Text>
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={[styles.dateInput, dateErrors.startDate && styles.errorInput]}
                  onPress={() => setShowStartCalendar(true)}
                >
                  <Text style={[styles.dateInputText, dateErrors.startDate && styles.errorText]}>
                    {periodStartDate || t('periodTracker.selectStartDate')}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
                {periodStartDate && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearStartDate}
                  >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
              {dateErrors.startDate && (
                <Text style={styles.errorMessage}>{dateErrors.startDate}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('periodTracker.endDate')}</Text>
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={[styles.dateInput, dateErrors.endDate && styles.errorInput]}
                  onPress={() => setShowEndCalendar(true)}
                >
                  <Text style={[styles.dateInputText, dateErrors.endDate && styles.errorText]}>
                    {periodEndDate || t('periodTracker.selectEndDate')}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
                {periodEndDate && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearEndDate}
                  >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
              {dateErrors.endDate && (
                <Text style={styles.errorMessage}>{dateErrors.endDate}</Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPeriodModal(false)}
              >
                <Text style={styles.cancelButtonText}>{getTranslation('periodTracker.cancel', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={savePeriodData}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>{getTranslation('periodTracker.save', 'Save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Period Modal */}
      <Modal
        visible={showEditPeriodModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowEditPeriodModal(false);
          setSelectedPeriod(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.detailModalHeader}>
              <Text style={styles.modalTitle}>{t('periodTracker.editPeriod') || 'Edit Period'}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowEditPeriodModal(false);
                  setSelectedPeriod(null);
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('periodTracker.startDate')}</Text>
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={[styles.dateInput, dateErrors.startDate && styles.errorInput]}
                  onPress={() => setShowStartCalendar(true)}
                >
                  <Text style={[styles.dateInputText, dateErrors.startDate && styles.errorText]}>
                    {periodStartDate || t('periodTracker.selectStartDate')}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
                {periodStartDate && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearStartDate}
                  >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
              {dateErrors.startDate && (
                <Text style={styles.errorMessage}>{dateErrors.startDate}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('periodTracker.endDate')}</Text>
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={[styles.dateInput, dateErrors.endDate && styles.errorInput]}
                  onPress={() => setShowEndCalendar(true)}
                >
                  <Text style={[styles.dateInputText, dateErrors.endDate && styles.errorText]}>
                    {periodEndDate || t('periodTracker.selectEndDate')}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
                {periodEndDate && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearEndDate}
                  >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
              {dateErrors.endDate && (
                <Text style={styles.errorMessage}>{dateErrors.endDate}</Text>
              )}
            </View>

            <View style={styles.editModalButtons}>
              <TouchableOpacity 
                style={[styles.deleteButton, saving && styles.disabledButton]}
                onPress={showDeleteConfirmation}
                disabled={saving}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>{getTranslation('periodTracker.delete', 'Delete')}</Text>
              </TouchableOpacity>
              <View style={styles.editModalButtonsRow}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { flex: 1 }]}
                  onPress={() => {
                    setShowEditPeriodModal(false);
                    setSelectedPeriod(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>{getTranslation('periodTracker.cancel', 'Cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, { flex: 1 }, saving && styles.disabledButton]}
                  onPress={updatePeriod}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>{getTranslation('periodTracker.update', 'Update')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalHeader}>
              <Ionicons name="warning" size={32} color="#F44336" />
              <Text style={styles.confirmModalTitle}>
                {getTranslation('periodTracker.deletePeriod', 'Delete Period')}
              </Text>
            </View>
            <Text style={styles.confirmModalMessage}>
              {getTranslation('periodTracker.confirmDelete', 'Are you sure you want to delete this period? This action cannot be undone.')}
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmCancelButton, saving && styles.disabledButton]}
                onPress={() => setShowDeleteConfirmModal(false)}
                disabled={saving}
              >
                <Text style={styles.confirmCancelButtonText}>
                  {getTranslation('periodTracker.cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmDeleteButton, saving && styles.disabledButton]}
                onPress={confirmDeletePeriod}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.confirmDeleteButtonText}>
                      {getTranslation('periodTracker.delete', 'Delete')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Symptom Delete Confirmation Modal */}
      <Modal
        visible={showSymptomDeleteConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSymptomDeleteConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalHeader}>
              <Ionicons name="warning" size={32} color="#F44336" />
              <Text style={styles.confirmModalTitle}>
                {getTranslation('periodTracker.deleteSymptom', 'Delete Symptom')}
              </Text>
            </View>
            <Text style={styles.confirmModalMessage}>
              {getTranslation('periodTracker.confirmDeleteSymptom', 'Are you sure you want to delete this symptom? This action cannot be undone.')}
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmCancelButton, saving && styles.disabledButton]}
                onPress={() => {
                  setShowSymptomDeleteConfirmModal(false);
                  setSelectedSymptomToDelete(null);
                }}
                disabled={saving}
              >
                <Text style={styles.confirmCancelButtonText}>
                  {getTranslation('periodTracker.cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmDeleteButton, saving && styles.disabledButton]}
                onPress={confirmDeleteSymptom}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.confirmDeleteButtonText}>
                      {getTranslation('periodTracker.delete', 'Delete')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message Modal (Success/Error) */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.messageModalContent}>
            <View style={styles.messageModalHeader}>
              {messageModalContent.type === 'success' ? (
                <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              ) : (
                <Ionicons name="close-circle" size={48} color="#F44336" />
              )}
              <Text style={styles.messageModalTitle}>
                {messageModalContent.title}
              </Text>
            </View>
            <Text style={styles.messageModalMessage}>
              {messageModalContent.message}
            </Text>
            <TouchableOpacity 
              style={[styles.messageModalButton, messageModalContent.type === 'success' ? styles.messageModalSuccessButton : styles.messageModalErrorButton]}
              onPress={() => setShowMessageModal(false)}
            >
              <Text style={styles.messageModalButtonText}>
                {getTranslation('common.ok', 'OK')}
              </Text>
            </TouchableOpacity>
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
            <Text style={styles.modalTitle}>{t('periodTracker.logSymptomModal')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('periodTracker.symptom')}</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowSymptomDropdown(true)}
              >
                <Text style={[styles.dropdownText, !newSymptom && styles.dropdownPlaceholder]}>
                  {newSymptom || t('periodTracker.selectSymptom')}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('periodTracker.severity')}</Text>
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
                      {severity === 'Light' ? t('periodTracker.light') : severity === 'Moderate' ? t('periodTracker.moderate') : t('periodTracker.severe')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowSymptomModal(false)}
              >
                <Text style={styles.cancelButtonText}>{getTranslation('periodTracker.cancel', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={saveSymptomData}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>{getTranslation('periodTracker.save', 'Save')}</Text>
                )}
              </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>

      {/* Start Date Calendar Modal */}
      <Modal
        visible={showStartCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStartCalendar(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>{t('periodTracker.selectStartDateTitle')}</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowStartCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleStartDateSelect}
              markedDates={periodStartDate ? {
                [periodStartDate]: { selected: true, selectedColor: '#e91e63' }
              } : {}}
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
          </View>
        </View>
      </Modal>

      {/* End Date Calendar Modal */}
      <Modal
        visible={showEndCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEndCalendar(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>{t('periodTracker.selectEndDateTitle')}</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowEndCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleEndDateSelect}
              markedDates={periodEndDate ? {
                [periodEndDate]: { selected: true, selectedColor: '#e91e63' }
              } : {}}
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
              minDate={periodStartDate || undefined}
            />
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
              <Text style={styles.dropdownTitle}>{t('periodTracker.selectSymptomTitle')}</Text>
              <TouchableOpacity 
                onPress={() => setShowSymptomDropdown(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownList}>
              {symptomOptions.map((option) => (
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
                {selectedSymptomDetail?.symptom || t('periodTracker.symptomDetails')}
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
                    {t('periodTracker.severityLabel')} {getSeverityText(selectedSymptomDetail.severity)}
                  </Text>
                </View>
                
                <View style={styles.contentSection}>
                  <Text style={styles.contentTitle}>{t('periodTracker.recommendations')}</Text>
                  <View style={[
                    styles.contentBox,
                    (selectedSymptomDetail.severity === 'Severe' || selectedSymptomDetail.severity === t('periodTracker.severe')) && styles.severeContentBox
                  ]}>
                    <Text style={[
                      styles.contentText,
                      (selectedSymptomDetail.severity === 'Severe' || selectedSymptomDetail.severity === t('periodTracker.severe')) && styles.severeContentText
                    ]}>
                      {getSymptomContent(selectedSymptomDetail.symptom, selectedSymptomDetail.severity)}
                    </Text>
                  </View>
                  
                  {(selectedSymptomDetail.severity === 'Severe' || selectedSymptomDetail.severity === t('periodTracker.severe')) && (
                    <View style={styles.alertBox}>
                      <Ionicons name="warning" size={24} color="#F44336" />
                      <Text style={styles.alertText}>{t('periodTracker.consultDoctor')}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.closeDetailButton}
              onPress={() => setShowSymptomDetailModal(false)}
            >
              <Text style={styles.closeDetailButtonText}>{t('periodTracker.close')}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fce4ec',
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
    color: '#e91e63',
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
  setupCard: {
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  setupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    marginLeft: 8,
  },
  setupText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  setupButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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
    position: 'relative',
  },
  symptomDeleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
  },
  symptomCardContent: {
    width: '100%',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  symptomDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
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
  quickLogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logButton: {
    flex: 1,
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e91e63',
    marginTop: 8,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyMonth: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  historyDays: {
    fontSize: 14,
    color: '#666',
  },
  historyStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editModalButtons: {
    marginTop: 20,
    gap: 12,
  },
  editModalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#e91e63',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F44336',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  confirmModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
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
    width: '100%',
    gap: 12,
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  confirmCancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F44336',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  messageModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  messageModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  messageModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  messageModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  messageModalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageModalSuccessButton: {
    backgroundColor: '#4CAF50',
  },
  messageModalErrorButton: {
    backgroundColor: '#F44336',
  },
  messageModalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

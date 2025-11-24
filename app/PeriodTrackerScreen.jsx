import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../config/firebase';

export default function PeriodTrackerScreen() {
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
  const [symptomSeverity, setSymptomSeverity] = useState('Light');
  const [dateErrors, setDateErrors] = useState({});
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [showSymptomDetailModal, setShowSymptomDetailModal] = useState(false);
  const [selectedSymptomDetail, setSelectedSymptomDetail] = useState(null);

  // Symptom options
  const symptomOptions = [
    'Cramps',
    'Bloating',
    'Headache',
    'Fatigue',
    'Vomit/Nausea',
    'Digestive issues',
    'Mood swings'
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
        Alert.alert('Validation Error', 'Please fix the date errors before saving');
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
      
      Alert.alert('Success', 'Period logged successfully!');
      setShowPeriodModal(false);
      // Reset form
      setPeriodStartDate(new Date().toISOString().split('T')[0]);
      setPeriodEndDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error saving period data:', error);
      Alert.alert('Error', 'Failed to save period data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset modal state when opening
  const openPeriodModal = () => {
    setPeriodStartDate(new Date().toISOString().split('T')[0]);
    setPeriodEndDate(new Date().toISOString().split('T')[0]);
    setDateErrors({});
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
      errors.startDate = 'Start date is required';
    } else if (isNaN(startDate.getTime())) {
      errors.startDate = 'Invalid start date format';
    } else if (startDate > todayDate) {
      errors.startDate = 'Start date cannot be in the future';
    }

    // Check if end date is provided
    if (!periodEndDate) {
      errors.endDate = 'End date is required';
    } else if (isNaN(endDate.getTime())) {
      errors.endDate = 'Invalid end date format';
    } else if (endDate > todayDate) {
      errors.endDate = 'End date cannot be in the future';
    }

    // Check if end date is after start date
    if (periodStartDate && periodEndDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (endDate < startDate) {
        errors.endDate = 'End date cannot be before start date';
      }
      
      // Check if period is too long (more than 10 days)
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 10) {
        errors.endDate = 'Period cannot be longer than 10 days';
      }
    }

    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle date selection from calendar
  const handleStartDateSelect = (day) => {
    setPeriodStartDate(day.dateString);
    setShowStartCalendar(false);
    // Clear start date error when user selects a date
    if (dateErrors.startDate) {
      setDateErrors(prev => ({ ...prev, startDate: null }));
    }
  };

  const handleEndDateSelect = (day) => {
    setPeriodEndDate(day.dateString);
    setShowEndCalendar(false);
    // Clear end date error when user selects a date
    if (dateErrors.endDate) {
      setDateErrors(prev => ({ ...prev, endDate: null }));
    }
  };

  // Save symptom data
  const saveSymptomData = async () => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      if (!newSymptom) {
        Alert.alert('Error', 'Please select a symptom');
        return;
      }

      const symptomData = {
        symptom: newSymptom,
        severity: symptomSeverity,
        date: selectedDate,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'users', userId, 'symptoms'), symptomData);

      // Refresh data
      await fetchSymptoms();
      
      Alert.alert('Success', 'Symptom logged successfully!');
      setShowSymptomModal(false);
      setNewSymptom('');
      setSymptomSeverity('Light');
    } catch (error) {
      console.error('Error saving symptom data:', error);
      Alert.alert('Error', 'Failed to save symptom data. Please try again.');
    } finally {
      setSaving(false);
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
        <Text style={styles.loadingText}>Loading your period data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Period Tracker</Text>
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
          <Text style={styles.statusTitle}>Next Period</Text>
        </View>
          <Text style={styles.statusText}>
            {nextPeriod ? nextPeriod.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }) : 'Not predicted'}
          </Text>
          <Text style={styles.statusSubtext}>
            {daysUntilNextPeriod > 0 
              ? `In ${daysUntilNextPeriod} days`
              : daysUntilNextPeriod === 0 
                ? 'Today'
                : 'Overdue'
            }
          </Text>
        </View>
      ) : (
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <Ionicons name="calendar" size={24} color="#e91e63" />
            <Text style={styles.setupTitle}>Set Up Period Tracking</Text>
          </View>
          <Text style={styles.setupText}>
            Start tracking your menstrual cycle to get personalized insights and predictions.
          </Text>
          <TouchableOpacity 
            style={styles.setupButton} 
            onPress={openPeriodModal}
          >
            <Text style={styles.setupButtonText}>Log Your First Period</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
      </View>
      )}

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          monthFormat={'MMMM yyyy'}
          markedDates={markedDates}
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
        <Text style={styles.sectionTitle}>Recent Symptoms</Text>
        {symptoms.length > 0 ? (
        <View style={styles.symptomsGrid}>
            {symptoms.slice(0, 4).map((symptom, index) => (
              <TouchableOpacity 
                key={symptom.id} 
                style={[styles.symptomCard, { backgroundColor: getSymptomCardColor(symptom.severity) }]}
                onPress={() => {
                  setSelectedSymptomDetail(symptom);
                  setShowSymptomDetailModal(true);
                }}
              >
                <Ionicons name="medical-outline" size={24} color="#e91e63" />
                <Text style={styles.symptomName}>{symptom.symptom}</Text>
                <Text style={styles.symptomSeverity}>{symptom.severity}</Text>
              </TouchableOpacity>
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
          <TouchableOpacity 
            style={styles.logButton}
            onPress={openPeriodModal}
          >
            <Ionicons name="add-circle" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>Log Period</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logButton}
            onPress={() => setShowSymptomModal(true)}
          >
            <Ionicons name="medical" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>Log Symptoms</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cycle History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Cycles</Text>
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
                    {period.periodLength ? `${period.periodLength} days` : 'Unknown duration'}
                  </Text>
                  <Text style={styles.historyStatus}>
                    {period.cycleLength && period.cycleLength >= 21 && period.cycleLength <= 35 ? 'Regular' : 'Irregular'}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No cycle history yet</Text>
            <Text style={styles.emptyStateSubtext}>Start logging your periods</Text>
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
            <Text style={styles.modalTitle}>Log Period</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TouchableOpacity 
                style={[styles.dateInput, dateErrors.startDate && styles.errorInput]}
                onPress={() => setShowStartCalendar(true)}
              >
                <Text style={[styles.dateInputText, dateErrors.startDate && styles.errorText]}>
                  {periodStartDate || 'Select start date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
              {dateErrors.startDate && (
                <Text style={styles.errorMessage}>{dateErrors.startDate}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TouchableOpacity 
                style={[styles.dateInput, dateErrors.endDate && styles.errorInput]}
                onPress={() => setShowEndCalendar(true)}
              >
                <Text style={[styles.dateInputText, dateErrors.endDate && styles.errorText]}>
                  {periodEndDate || 'Select end date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
              {dateErrors.endDate && (
                <Text style={styles.errorMessage}>{dateErrors.endDate}</Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPeriodModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={savePeriodData}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
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
            <Text style={styles.modalTitle}>Log Symptom</Text>
            
            <View style={styles.inputGroup}>
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

            <View style={styles.inputGroup}>
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
                style={styles.cancelButton}
                onPress={() => setShowSymptomModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={saveSymptomData}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
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
              <Text style={styles.calendarTitle}>Select Start Date</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowStartCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleStartDateSelect}
              markedDates={{
                [periodStartDate]: { selected: true, selectedColor: '#e91e63' }
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
              <Text style={styles.calendarTitle}>Select End Date</Text>
              <TouchableOpacity 
                style={styles.calendarCloseButton}
                onPress={() => setShowEndCalendar(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleEndDateSelect}
              markedDates={{
                [periodEndDate]: { selected: true, selectedColor: '#e91e63' }
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
              <Text style={styles.dropdownTitle}>Select Symptom</Text>
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
                      {getSymptomContent(selectedSymptomDetail.symptom, selectedSymptomDetail.severity)}
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

            <TouchableOpacity 
              style={styles.closeDetailButton}
              onPress={() => setShowSymptomDetailModal(false)}
            >
              <Text style={styles.closeDetailButtonText}>Close</Text>
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
  disabledButton: {
    opacity: 0.6,
  },
  dateInput: {
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
});

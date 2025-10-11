import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../config/firebase';

export default function PregnancyTrackerScreen() {
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
  const [tempSystolic, setTempSystolic] = useState('');
  const [tempDiastolic, setTempDiastolic] = useState('');
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

  const [symptoms, setSymptoms] = useState([
    { name: 'Nausea', severity: 'Mild', icon: 'medical-outline', logged: true },
    { name: 'Fatigue', severity: 'Moderate', icon: 'battery-half-outline', logged: true },
    { name: 'Mood', severity: 'Good', icon: 'happy-outline', logged: false },
    { name: 'Appetite', severity: 'Normal', icon: 'restaurant-outline', logged: false },
  ]);

  const [appointments, setAppointments] = useState([]);

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
      Alert.alert('Error', 'Failed to save pregnancy data');
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
      Alert.alert('Error', 'Failed to load pregnancy data');
    } finally {
      setLoading(false);
    }
  };

  const saveWeightEntry = async (weightEntry) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const weightCollectionRef = collection(db, 'users', userId, 'weightHistory');
      await addDoc(weightCollectionRef, weightEntry);
      
      console.log('Weight entry saved successfully');
    } catch (error) {
      console.error('Error saving weight entry:', error);
      Alert.alert('Error', 'Failed to save weight entry');
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
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const bpCollectionRef = collection(db, 'users', userId, 'bpHistory');
      await addDoc(bpCollectionRef, bpEntry);
      
      console.log('BP entry saved successfully');
    } catch (error) {
      console.error('Error saving BP entry:', error);
      Alert.alert('Error', 'Failed to save blood pressure entry');
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

  const saveAppointment = async (appointment) => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const appointmentCollectionRef = collection(db, 'users', userId, 'appointments');
      await addDoc(appointmentCollectionRef, appointment);
      
      console.log('Appointment saved successfully');
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'Failed to save appointment');
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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPregnancyData(),
        fetchWeightHistory(),
        fetchBPHistory(),
        fetchAppointments()
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

  // Validate due date
  const validateDueDate = (date) => {
    const errors = {};
    const today = new Date();
    const selectedDate = new Date(date);
    
    if (!date) {
      errors.dueDate = 'Due date is required';
    } else if (isNaN(selectedDate.getTime())) {
      errors.dueDate = 'Invalid date format';
    } else if (selectedDate <= today) {
      errors.dueDate = 'Due date must be in the future';
    } else {
    // Calculate LMP (40 weeks before due date)
    const lmpDate = new Date(selectedDate);
    lmpDate.setDate(lmpDate.getDate() - (40 * 7));
    
    // Validate pregnancy timeframe (LMP should not be more than 42 weeks ago)
    const maxLMPDate = new Date(today);
      maxLMPDate.setDate(maxLMPDate.getDate() - (42 * 7));
    
    if (lmpDate < maxLMPDate) {
        errors.dueDate = 'Due date is too far in the future (max 10 months)';
    }
    
    // Validate that due date is not too far in the future (max 10 months)
    const maxDueDate = new Date(today);
    maxDueDate.setMonth(maxDueDate.getMonth() + 10);
    
    if (selectedDate > maxDueDate) {
        errors.dueDate = 'Due date is too far in the future (max 10 months)';
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
      errors.appointmentDate = 'Appointment date is required';
    } else if (isNaN(selectedDate.getTime())) {
      errors.appointmentDate = 'Invalid date format';
    } else if (selectedDate < today) {
      errors.appointmentDate = 'Appointment date cannot be in the past';
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
      Alert.alert('Validation Error', 'Please fix the date errors before saving');
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
    Alert.alert('Success', 'Due date saved successfully!');
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
      { week: 8, title: 'Heartbeat detectable', completed: currentWeek >= 8 },
      { week: 12, title: 'First trimester screening', completed: currentWeek >= 12 },
      { week: 16, title: 'Gender reveal possible', completed: currentWeek >= 16 },
      { week: 20, title: 'Anatomy scan', completed: currentWeek >= 20 },
      { week: 24, title: 'Viability milestone', completed: currentWeek >= 24 },
      { week: 28, title: 'Third trimester begins', completed: currentWeek >= 28 },
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

  const handleLogSymptom = (symptomIndex) => {
    const newSymptoms = [...symptoms];
    newSymptoms[symptomIndex].logged = !newSymptoms[symptomIndex].logged;
    setSymptoms(newSymptoms);
  };

  const handleAddAppointment = () => {
    setTempAppointment({
      type: '',
      date: '',
      time: '',
      doctor: ''
    });
    setShowAppointmentModal(true);
  };


  const handleSaveAppointment = async () => {
    if (!tempAppointment.type || !tempAppointment.date || !tempAppointment.time || !tempAppointment.doctor) {
      Alert.alert('Error', 'Please fill in all appointment details');
      return;
    }

    // Validate appointment date
    if (!validateAppointmentDate(tempAppointment.date)) {
      Alert.alert('Validation Error', 'Please fix the date errors before saving');
      return;
    }

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

    setShowAppointmentModal(false);
    setTempAppointment({
      type: '',
      date: '',
      time: '',
      doctor: ''
    });
    Alert.alert('Success', 'Appointment added successfully!');
  };

  const handleLogWeight = () => {
    setTempWeight('');
    setShowWeightModal(true);
  };

  const handleSaveWeight = async () => {
    if (!tempWeight || isNaN(parseFloat(tempWeight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    const weight = parseFloat(tempWeight);
    if (weight < 30 || weight > 200) {
      Alert.alert('Error', 'Please enter a realistic weight (30-200 kg)');
      return;
    }

    const newWeightEntry = {
      weight: weight,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    // Save to Firestore
    await saveWeightEntry(newWeightEntry);
    
    // Update local state
    setWeightHistory(prev => [newWeightEntry, ...prev]);
    
    // Update pregnancy data with latest weight
    const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : weight;
    const weightGain = latestWeight - 60; // Assuming starting weight of 60kg
    
    const updatedPregnancyData = {
      ...pregnancyData,
      weightGain: Math.max(0, weightGain)
    };
    
    setPregnancyData(updatedPregnancyData);
    await savePregnancyData(updatedPregnancyData);

    setShowWeightModal(false);
    setTempWeight('');
    Alert.alert('Success', 'Weight logged successfully!');
  };

  const handleLogBloodPressure = () => {
    setTempSystolic('');
    setTempDiastolic('');
    setShowBPModal(true);
  };

  const handleSaveBloodPressure = async () => {
    if (!tempSystolic || !tempDiastolic || isNaN(parseInt(tempSystolic)) || isNaN(parseInt(tempDiastolic))) {
      Alert.alert('Error', 'Please enter valid blood pressure values');
      return;
    }

    const systolic = parseInt(tempSystolic);
    const diastolic = parseInt(tempDiastolic);

    if (systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 120) {
      Alert.alert('Error', 'Please enter realistic blood pressure values');
      return;
    }

    const newBPEntry = {
      systolic: systolic,
      diastolic: diastolic,
      date: new Date().toISOString().split('T')[0],
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

    setShowBPModal(false);
    setTempSystolic('');
    setTempDiastolic('');
    Alert.alert('Success', 'Blood pressure logged successfully!');
  };

  const getMarkedDates = () => {
    const marked = {};
    
    // Due date
    if (pregnancyData.dueDate) {
      marked[pregnancyData.dueDate] = { 
        selected: true, 
        selectedColor: '#e91e63', 
        marked: true, 
        dotColor: '#e91e63',
        customStyles: {
          container: {
            backgroundColor: '#e91e63',
            borderRadius: 16,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          }
        }
      };
    }
    
    // Appointments
    appointments.forEach(appointment => {
      if (appointment.date) {
        marked[appointment.date] = {
          ...marked[appointment.date],
          marked: true,
          dotColor: '#2196F3',
          customStyles: {
            container: {
              backgroundColor: '#e3f2fd',
              borderRadius: 8,
            },
            text: {
              color: '#1976d2',
              fontWeight: '600',
            }
          }
        };
      }
    });
    
    // Weight logs
    weightHistory.forEach(entry => {
      if (entry.date) {
        marked[entry.date] = {
          ...marked[entry.date],
          marked: true,
          dotColor: '#4CAF50',
          customStyles: {
            container: {
              backgroundColor: '#e8f5e8',
              borderRadius: 8,
            },
            text: {
              color: '#2e7d32',
              fontWeight: '500',
            }
          }
        };
      }
    });
    
    // Blood pressure logs
    bpHistory.forEach(entry => {
      if (entry.date) {
        marked[entry.date] = {
          ...marked[entry.date],
          marked: true,
          dotColor: '#ff9800',
          customStyles: {
            container: {
              backgroundColor: '#fff3e0',
              borderRadius: 8,
            },
            text: {
              color: '#f57c00',
              fontWeight: '500',
            }
          }
        };
      }
    });
    
    // Pregnancy milestones
    milestones.forEach(milestone => {
      if (milestone.completed && pregnancyData.dueDate) {
        const milestoneDate = new Date(pregnancyData.dueDate);
        // Validate the date before using it
        if (isNaN(milestoneDate.getTime())) return;
        
        milestoneDate.setDate(milestoneDate.getDate() - ((40 - milestone.week) * 7));
        const dateString = milestoneDate.toISOString().split('T')[0];
        
        marked[dateString] = {
          ...marked[dateString],
          marked: true,
          dotColor: '#9c27b0',
          customStyles: {
            container: {
              backgroundColor: '#f3e5f5',
              borderRadius: 8,
            },
            text: {
              color: '#7b1fa2',
              fontWeight: '600',
            }
          }
        };
      }
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
        <Text style={styles.loadingText}>Loading your pregnancy data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pregnancy Tracker</Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
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
              Welcome to Pregnancy Tracker
            </Text>
          </View>
          <Text style={styles.statusText}>Set your due date to get started</Text>
          <TouchableOpacity style={styles.setupButton} onPress={() => setShowDueDateModal(true)}>
            <Text style={styles.setupButtonText}>Set Due Date</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.statusCard, { backgroundColor: getTrimesterColor(getCurrentTrimester) + '20' }]}>
          <View style={styles.statusHeader}>
            <Ionicons name="baby" size={24} color={getTrimesterColor(getCurrentTrimester)} />
            <Text style={[styles.statusTitle, { color: getTrimesterColor(getCurrentTrimester) }]}>
              Week {getCurrentWeek} - Trimester {getCurrentTrimester}
            </Text>
            <TouchableOpacity onPress={handleEditDueDate} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.statusText}>Due Date: {pregnancyData.dueDate}</Text>
          <Text style={styles.statusSubtext}>
            {calculateDaysUntilDue()} days to go
          </Text>
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="scale-outline" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>+{pregnancyData.weightGain} kg</Text>
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
        <Text style={styles.sectionTitle}>Today's Symptoms</Text>
        <View style={styles.symptomsGrid}>
          {symptoms.map((symptom, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.symptomCard,
                symptom.logged && styles.symptomCardLogged
              ]}
              onPress={() => handleLogSymptom(index)}
            >
              <Ionicons 
                name={symptom.icon} 
                size={24} 
                color={symptom.logged ? '#4CAF50' : '#e91e63'} 
              />
              <Text style={styles.symptomName}>{symptom.name}</Text>
              <Text style={styles.symptomSeverity}>{symptom.severity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickLogContainer}>
          <TouchableOpacity style={styles.logButton} onPress={handleLogWeight}>
            <Ionicons name="scale" size={24} color="#4CAF50" />
            <Text style={styles.logButtonText}>Log Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logButton} onPress={handleLogBloodPressure}>
            <Ionicons name="heart" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>Log BP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logButton} onPress={handleAddAppointment}>
            <Ionicons name="calendar" size={24} color="#2196F3" />
            <Text style={styles.logButtonText}>Add Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <View style={styles.appointmentsCard}>
          {appointments.slice(0, 3).map((appointment, index) => (
            <View key={index} style={styles.appointmentItem}>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
                <Text style={styles.appointmentDate}>{appointment.date} at {appointment.time}</Text>
                <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
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
                  <Ionicons name="scale" size={20} color="#4CAF50" />
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
                  <Ionicons name="heart" size={20} color="#e91e63" />
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
            <Text style={styles.modalTitle}>Log Weight</Text>
            <Text style={styles.modalSubtitle}>
              Enter your current weight to track your pregnancy progress
            </Text>
            
            <View style={styles.inputContainer}>
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
                <Text style={styles.confirmButtonText}>Save Weight</Text>
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
            <Text style={styles.modalTitle}>Log Blood Pressure</Text>
            <Text style={styles.modalSubtitle}>
              Enter your current blood pressure readings
            </Text>
            
            <View style={styles.inputContainer}>
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
                <Text style={styles.confirmButtonText}>Save BP</Text>
                )}
              </TouchableOpacity>
            </View>
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
            <Text style={styles.modalTitle}>Add Appointment</Text>
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
                <Text style={styles.confirmButtonText}>Add Appointment</Text>
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
    marginLeft: 'auto',
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
  historyInfo: {
    flex: 1,
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
});

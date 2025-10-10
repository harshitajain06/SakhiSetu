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
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodStartDate, setPeriodStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodEndDate, setPeriodEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSymptom, setNewSymptom] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('Mild');

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
      const nextPeriodDate = new Date(lastPeriodDate);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + menstrualData.cycleLength);
      
      const nextPeriodStr = nextPeriodDate.toISOString().split('T')[0];
      marked[nextPeriodStr] = { 
        marked: true, 
        dotColor: '#e91e63' 
      };
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
      if (!periodStartDate || !periodEndDate) {
        Alert.alert('Error', 'Please select both start and end dates');
        return;
      }

      if (new Date(periodEndDate) < new Date(periodStartDate)) {
        Alert.alert('Error', 'End date cannot be before start date');
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
    setShowPeriodModal(true);
  };

  // Save symptom data
  const saveSymptomData = async () => {
    try {
      setSaving(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      if (!newSymptom.trim()) {
        Alert.alert('Error', 'Please enter a symptom');
        return;
      }

      const symptomData = {
        symptom: newSymptom.trim(),
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
      setSymptomSeverity('Mild');
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
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
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
              <View key={symptom.id} style={styles.symptomCard}>
                <Ionicons name="medical-outline" size={24} color="#e91e63" />
                <Text style={styles.symptomName}>{symptom.symptom}</Text>
              <Text style={styles.symptomSeverity}>{symptom.severity}</Text>
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
              <TextInput
                style={styles.dateInput}
                value={periodStartDate}
                onChangeText={setPeriodStartDate}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TextInput
                style={styles.dateInput}
                value={periodEndDate}
                onChangeText={setPeriodEndDate}
                placeholder="YYYY-MM-DD"
              />
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
              <TextInput
                style={styles.textInput}
                value={newSymptom}
                onChangeText={setNewSymptom}
                placeholder="e.g., Cramps, Bloating, Headache"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Severity</Text>
              <View style={styles.severityButtons}>
                {['Mild', 'Moderate', 'Severe'].map((severity) => (
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
});

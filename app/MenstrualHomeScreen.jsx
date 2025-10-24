import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InformationIcon from '../components/InformationIcon';
import { auth, db } from '../config/firebase';

export default function MenstrualHomeScreen() {
  const navigation = useNavigation();
  const [menstrualData, setMenstrualData] = useState({
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: null,
    isSetup: false
  });
  const [periodHistory, setPeriodHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user ID
  const getCurrentUserId = () => {
    return auth.currentUser?.uid;
  };

  // Calculate current cycle day
  const calculateCurrentCycleDay = () => {
    if (!menstrualData.lastPeriod) return 0;
    
    const lastPeriodDate = new Date(menstrualData.lastPeriod);
    const today = new Date();
    const diffTime = today - lastPeriodDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.min(diffDays + 1, menstrualData.cycleLength);
  };

  // Calculate next period date
  const calculateNextPeriod = () => {
    if (!menstrualData.lastPeriod) return null;
    
    const lastPeriodDate = new Date(menstrualData.lastPeriod);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + menstrualData.cycleLength);
    
    return nextPeriodDate;
  };

  // Calculate fertile window
  const calculateFertileWindow = () => {
    if (!menstrualData.lastPeriod) return null;
    
    const lastPeriodDate = new Date(menstrualData.lastPeriod);
    const ovulationDate = new Date(lastPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() + menstrualData.cycleLength - 14);
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return { start: fertileStart, end: fertileEnd };
  };

  // Fetch menstrual data from Firestore
  const fetchMenstrualData = async () => {
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
        if (userData.menstrualData) {
          setMenstrualData(userData.menstrualData);
        }
      }
    } catch (error) {
      console.error('Error fetching menstrual data:', error);
    } finally {
      setLoading(false);
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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchMenstrualData(),
        fetchPeriodHistory(),
        fetchSymptoms()
      ]);
    };
    
    loadData();
  }, []);

  // Calculate derived data
  const currentCycleDay = calculateCurrentCycleDay();
  const nextPeriod = calculateNextPeriod();
  const fertileWindow = calculateFertileWindow();
  const daysUntilNextPeriod = nextPeriod ? Math.ceil((nextPeriod - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  // Navigation handlers
  const navigateToTracker = () => {
    navigation.navigate('PeriodTracker');
  };

  const navigateToInsights = () => {
    navigation.navigate('CycleInsights');
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Loading your menstrual data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menstrual Health</Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Current Cycle Status */}
      {menstrualData.isSetup ? (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="heart" size={24} color="#e91e63" />
            <Text style={styles.statusTitle}>Current Cycle</Text>
          </View>
          <Text style={styles.statusText}>Day {currentCycleDay} of {menstrualData.cycleLength}</Text>
          <Text style={styles.statusSubtext}>
            {daysUntilNextPeriod > 0 
              ? `Next period in ${daysUntilNextPeriod} days`
              : 'Period is due'
            }
          </Text>
        </View>
      ) : (
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <Ionicons name="heart" size={24} color="#e91e63" />
            <Text style={styles.setupTitle}>Welcome to Menstrual Health</Text>
          </View>
          <Text style={styles.setupText}>
            Set up your menstrual cycle tracking to get personalized insights and predictions.
          </Text>
          <TouchableOpacity style={styles.setupButton} onPress={navigateToTracker}>
            <Text style={styles.setupButtonText}>Set Up Cycle Tracking</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToTracker}>
            <View style={styles.actionHeader}>
              <Ionicons name="add-circle-outline" size={32} color="#e91e63" />
              <InformationIcon 
                info="Track the start and end dates of your menstrual period to monitor your cycle patterns and predict future periods. This helps you understand your body's natural rhythm and identify any irregularities."
                size={16}
                color="#e91e63"
                title="Log Period"
              />
            </View>
            <Text style={styles.actionText}>Log Period</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToTracker}>
            <View style={styles.actionHeader}>
              <Ionicons name="medical-outline" size={32} color="#e91e63" />
              <InformationIcon 
                info="Record symptoms like cramps, mood changes, bloating, and other physical or emotional changes throughout your cycle. This data helps you and your healthcare provider understand patterns and manage your health better."
                size={16}
                color="#e91e63"
                title="Log Symptoms"
              />
            </View>
            <Text style={styles.actionText}>Log Symptoms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToTracker}>
            <Ionicons name="calendar-outline" size={32} color="#e91e63" />
            <Text style={styles.actionText}>View Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToInsights}>
            <Ionicons name="analytics-outline" size={32} color="#e91e63" />
            <Text style={styles.actionText}>Insights</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {periodHistory.length > 0 ? (
            periodHistory.slice(0, 2).map((period, index) => {
              const startDate = new Date(period.startDate);
              const endDate = new Date(period.endDate);
              const isValidStart = !isNaN(startDate.getTime());
              const isValidEnd = !isNaN(endDate.getTime());
              
              return (
                <View key={period.id} style={styles.activityItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.activityText}>
                    Period logged for {isValidStart ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}-{isValidEnd ? endDate.toLocaleDateString('en-US', { day: 'numeric' }) : 'Unknown'}
                  </Text>
                  <Text style={styles.activityTime}>
                    {isValidStart ? Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) : 0} days ago
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.activityItem}>
              <Ionicons name="information-circle" size={20} color="#666" />
              <Text style={styles.activityText}>No recent activity</Text>
              <Text style={styles.activityTime}>Start tracking your cycle</Text>
            </View>
          )}
          
          {symptoms.length > 0 && (
            <View style={styles.activityItem}>
              <Ionicons name="medical" size={20} color="#FF9800" />
              <Text style={styles.activityText}>
                {symptoms[0].symptoms?.join(', ') || 'Symptoms logged'}
              </Text>
              <Text style={styles.activityTime}>
                {Math.floor((new Date() - new Date(symptoms[0].date)) / (1000 * 60 * 60 * 24))} days ago
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Cycle Insights Preview */}
      {menstrualData.isSetup && periodHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cycle Insights</Text>
          <View style={styles.insightsPreview}>
            <View style={styles.insightItem}>
              <Ionicons name="calendar" size={20} color="#e91e63" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Average Cycle Length</Text>
                <Text style={styles.insightValue}>
                  {Math.round(periodHistory.reduce((acc, period) => acc + period.cycleLength, 0) / periodHistory.length)} days
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="time" size={20} color="#2196F3" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Average Period Length</Text>
                <Text style={styles.insightValue}>
                  {Math.round(periodHistory.reduce((acc, period) => acc + period.periodLength, 0) / periodHistory.length)} days
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton} onPress={navigateToInsights}>
            <Text style={styles.viewMoreText}>View Detailed Insights</Text>
            <Ionicons name="arrow-forward" size={16} color="#e91e63" />
          </TouchableOpacity>
        </View>
      )}

      {/* Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#FFC107" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipText}>Drink plenty of water during your cycle to help with bloating and energy levels.</Text>
          </View>
        </View>
      </View>
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
    marginBottom: 24,
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
    fontSize: 24,
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
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  insightsPreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '500',
    marginRight: 4,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

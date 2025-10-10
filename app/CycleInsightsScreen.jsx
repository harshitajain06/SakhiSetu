import { Ionicons } from '@expo/vector-icons';
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
import { auth, db } from '../config/firebase';

export default function CycleInsightsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [menstrualData, setMenstrualData] = useState({
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: null,
    isSetup: false
  });
  const [periodHistory, setPeriodHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

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

  // Calculate insights from period history
  const calculateInsights = () => {
    if (periodHistory.length === 0) {
      setInsights([]);
      return;
    }

    const cycleLengths = periodHistory.map(period => period.cycleLength);
    const periodLengths = periodHistory.map(period => period.periodLength);
    
    const avgCycleLength = cycleLengths.reduce((acc, length) => acc + length, 0) / cycleLengths.length;
    const avgPeriodLength = periodLengths.reduce((acc, length) => acc + length, 0) / periodLengths.length;
    
    // Calculate consistency (how close cycle lengths are to average)
    const cycleVariance = cycleLengths.reduce((acc, length) => acc + Math.pow(length - avgCycleLength, 2), 0) / cycleLengths.length;
    const cycleStdDev = Math.sqrt(cycleVariance);
    const consistencyScore = Math.max(0, 100 - (cycleStdDev * 10)); // Convert to percentage

    const calculatedInsights = [
      {
        title: 'Average Cycle Length',
        value: `${avgCycleLength.toFixed(1)} days`,
        description: avgCycleLength >= 21 && avgCycleLength <= 35 ? 'Your cycles are generally regular' : 'Your cycles may need attention',
        icon: 'calendar-outline',
        color: avgCycleLength >= 21 && avgCycleLength <= 35 ? '#4CAF50' : '#FF7043'
      },
      {
        title: 'Average Period Length',
        value: `${avgPeriodLength.toFixed(1)} days`,
        description: avgPeriodLength >= 3 && avgPeriodLength <= 7 ? 'Within normal range (3-7 days)' : 'May need medical attention',
        icon: 'time-outline',
        color: avgPeriodLength >= 3 && avgPeriodLength <= 7 ? '#2196F3' : '#FF7043'
      },
      {
        title: 'Consistency Score',
        value: `${consistencyScore.toFixed(0)}%`,
        description: consistencyScore >= 80 ? 'Very consistent cycle patterns' : consistencyScore >= 60 ? 'Moderately consistent' : 'Inconsistent patterns',
        icon: 'trending-up-outline',
        color: consistencyScore >= 80 ? '#4CAF50' : consistencyScore >= 60 ? '#FF9800' : '#FF7043'
      },
    ];

    setInsights(calculatedInsights);
  };

  // Calculate next period and fertile window
  const calculatePredictions = () => {
    if (!menstrualData.lastPeriod || periodHistory.length === 0) {
      return {
        nextPeriod: null,
        fertileWindow: null,
        ovulation: null
      };
    }

    const lastPeriodDate = new Date(menstrualData.lastPeriod);
    const avgCycleLength = periodHistory.reduce((acc, period) => acc + period.cycleLength, 0) / periodHistory.length;
    
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    
    const ovulationDate = new Date(lastPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() + avgCycleLength - 14);
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    return {
      nextPeriod: nextPeriodDate,
      fertileWindow: { start: fertileStart, end: fertileEnd },
      ovulation: ovulationDate
    };
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

  // Calculate insights when period history changes
  useEffect(() => {
    calculateInsights();
  }, [periodHistory]);

  const predictions = calculatePredictions();
  const cycleData = periodHistory.map(period => {
    // Ensure dates are properly formatted
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    
    // Check if dates are valid
    const isValidStart = !isNaN(startDate.getTime());
    const isValidEnd = !isNaN(endDate.getTime());
    
    return {
      month: isValidStart ? startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown Month',
      days: (isValidStart && isValidEnd) ? `${startDate.getDate()}-${endDate.getDate()}` : 'Invalid dates',
      length: period.cycleLength ? period.cycleLength.toString() : 'Unknown',
      status: period.cycleLength && period.cycleLength >= 21 && period.cycleLength <= 35 ? 'Regular' : 'Irregular',
      color: period.cycleLength && period.cycleLength >= 21 && period.cycleLength <= 35 ? '#4CAF50' : '#FF7043'
    };
  });

  // Show loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Loading your cycle insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cycle Insights</Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Period Filter */}
      <View style={styles.filterContainer}>
        {['3months', '6months', '1year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.filterButton, selectedPeriod === period && styles.activeFilter]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[styles.filterText, selectedPeriod === period && styles.activeFilterText]}>
              {period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Setup Message if no data */}
      {!menstrualData.isSetup || periodHistory.length === 0 ? (
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <Ionicons name="analytics" size={24} color="#e91e63" />
            <Text style={styles.setupTitle}>No Cycle Data Yet</Text>
          </View>
          <Text style={styles.setupText}>
            Start tracking your menstrual cycle to see personalized insights and predictions.
          </Text>
        </View>
      ) : (
        <>
          {/* Key Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            {insights.length > 0 ? (
              <View style={styles.insightsGrid}>
                {insights.map((insight, index) => (
                  <View key={index} style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                      <Ionicons name={insight.icon} size={24} color={insight.color} />
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                    </View>
                    <Text style={styles.insightValue}>{insight.value}</Text>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="analytics-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>Not enough data for insights</Text>
                <Text style={styles.emptyStateSubtext}>Track more cycles to see patterns</Text>
              </View>
            )}
          </View>

          {/* Cycle History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cycle History</Text>
            {cycleData.length > 0 ? (
              <View style={styles.historyCard}>
                {cycleData.map((cycle, index) => (
                  <View key={index} style={styles.historyRow}>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyMonth}>{cycle.month}</Text>
                      <Text style={styles.historyDays}>Days {cycle.days}</Text>
                    </View>
                    <View style={styles.historyStats}>
                      <Text style={styles.historyLength}>{cycle.length} days</Text>
                      <View style={[styles.statusBadge, { borderColor: cycle.color }]}>
                        <Text style={[styles.statusText, { color: cycle.color }]}>{cycle.status}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No cycle history yet</Text>
                <Text style={styles.emptyStateSubtext}>Start logging your periods</Text>
              </View>
            )}
          </View>

          {/* Predictions */}
          {predictions.nextPeriod && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Predictions</Text>
              <View style={styles.predictionCard}>
                <View style={styles.predictionItem}>
                  <Ionicons name="calendar" size={20} color="#e91e63" />
                  <View style={styles.predictionContent}>
                    <Text style={styles.predictionTitle}>Next Period</Text>
                    <Text style={styles.predictionValue}>
                      {predictions.nextPeriod.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </View>
                </View>
                {predictions.fertileWindow && (
                  <View style={styles.predictionItem}>
                    <Ionicons name="heart" size={20} color="#FF9800" />
                    <View style={styles.predictionContent}>
                      <Text style={styles.predictionTitle}>Fertile Window</Text>
                      <Text style={styles.predictionValue}>
                        {predictions.fertileWindow.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {predictions.fertileWindow.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                )}
                {predictions.ovulation && (
                  <View style={styles.predictionItem}>
                    <Ionicons name="thermometer" size={20} color="#2196F3" />
                    <View style={styles.predictionContent}>
                      <Text style={styles.predictionTitle}>Ovulation</Text>
                      <Text style={styles.predictionValue}>
                        {predictions.ovulation.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Health Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Recommendations</Text>
            <View style={styles.recommendationCard}>
              <Ionicons name="bulb-outline" size={24} color="#FFC107" />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Stay Hydrated</Text>
                <Text style={styles.recommendationText}>
                  Your cycle patterns suggest you might benefit from increased water intake during your period.
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
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
    lineHeight: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#e91e63',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
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
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  insightDescription: {
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
  historyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  historyRow: {
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
  historyMonth: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  historyDays: {
    fontSize: 12,
    color: '#666',
  },
  historyStats: {
    alignItems: 'flex-end',
  },
  historyLength: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  predictionCard: {
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 16,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  predictionContent: {
    flex: 1,
    marginLeft: 12,
  },
  predictionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

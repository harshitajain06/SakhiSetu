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
import { useTranslation } from '../contexts/TranslationContext';
import { auth, db } from '../config/firebase';

export default function CycleInsightsScreen() {
  const { t } = useTranslation();
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
  const [refreshing, setRefreshing] = useState(false);
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

  // Calculate actual cycle lengths from period history
  const calculateActualCycleLengths = () => {
    if (periodHistory.length < 2) {
      return [];
    }

    // Sort periods by start date (ascending) to calculate actual cycle lengths
    const sortedPeriods = [...periodHistory].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    });

    // Calculate actual cycle lengths (days between consecutive period start dates)
    const actualCycleLengths = [];
    for (let i = 1; i < sortedPeriods.length; i++) {
      const prevStartDate = new Date(sortedPeriods[i - 1].startDate);
      const currStartDate = new Date(sortedPeriods[i].startDate);
      
      // Validate dates
      if (!isNaN(prevStartDate.getTime()) && !isNaN(currStartDate.getTime())) {
        const daysDiff = Math.ceil((currStartDate - prevStartDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 0 && daysDiff < 90) { // Sanity check: cycle should be between 1-90 days
          actualCycleLengths.push(daysDiff);
        }
      }
    }

    return actualCycleLengths;
  };

  // Calculate insights from period history
  const calculateInsights = () => {
    if (periodHistory.length === 0) {
      setInsights([]);
      return;
    }

    // Calculate actual cycle lengths
    const actualCycleLengths = calculateActualCycleLengths();

    // Sort periods by start date for period length calculation
    const sortedPeriods = [...periodHistory].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    });

    // Get period lengths
    const periodLengths = sortedPeriods
      .map(period => period.periodLength)
      .filter(length => length && length > 0 && length < 15); // Sanity check: period should be 1-14 days

    // Calculate averages
    const avgCycleLength = actualCycleLengths.length > 0
      ? actualCycleLengths.reduce((acc, length) => acc + length, 0) / actualCycleLengths.length
      : (menstrualData.cycleLength || 28); // Fallback to configured cycle length
    
    const avgPeriodLength = periodLengths.length > 0
      ? periodLengths.reduce((acc, length) => acc + length, 0) / periodLengths.length
      : (menstrualData.periodLength || 5); // Fallback to configured period length
    
    // Calculate consistency score based on actual cycle lengths
    let consistencyScore = 0;
    if (actualCycleLengths.length >= 2) {
      // Calculate coefficient of variation (CV) = stdDev / mean
      const mean = avgCycleLength;
      const variance = actualCycleLengths.reduce((acc, length) => acc + Math.pow(length - mean, 2), 0) / actualCycleLengths.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;
      
      // Convert CV to consistency score (0-100)
      // Lower CV = higher consistency
      // CV of 0 = 100% consistency, CV of 0.2 (20%) = 0% consistency
      consistencyScore = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 500)));
    } else if (actualCycleLengths.length === 1) {
      // With only one cycle, we can't calculate consistency, but we can give a neutral score
      consistencyScore = 50;
    } else {
      // No cycle data available
      consistencyScore = 0;
    }

    const calculatedInsights = [
      {
        title: t('cycleInsights.averageCycleLength'),
        value: `${avgCycleLength.toFixed(1)} ${t('insights.days')}`,
        description: avgCycleLength >= 21 && avgCycleLength <= 35 ? t('cycleInsights.cyclesRegular') : t('cycleInsights.cyclesNeedAttention'),
        icon: 'calendar-outline',
        color: avgCycleLength >= 21 && avgCycleLength <= 35 ? '#4CAF50' : '#FF7043'
      },
      {
        title: t('cycleInsights.averagePeriodLength'),
        value: `${avgPeriodLength.toFixed(1)} ${t('insights.days')}`,
        description: avgPeriodLength >= 3 && avgPeriodLength <= 7 ? t('cycleInsights.withinNormalRange') : t('cycleInsights.mayNeedMedicalAttention'),
        icon: 'time-outline',
        color: avgPeriodLength >= 3 && avgPeriodLength <= 7 ? '#2196F3' : '#FF7043'
      },
      {
        title: t('cycleInsights.consistencyScore'),
        value: actualCycleLengths.length >= 2 
          ? `${consistencyScore.toFixed(0)}%`
          : actualCycleLengths.length === 1
          ? `${consistencyScore.toFixed(0)}%`
          : 'N/A',
        description: actualCycleLengths.length >= 2
          ? (consistencyScore >= 80 ? t('cycleInsights.veryConsistent') : consistencyScore >= 60 ? t('cycleInsights.moderatelyConsistent') : t('cycleInsights.inconsistentPatterns'))
          : actualCycleLengths.length === 1
          ? t('cycleInsights.trackMoreCycles')
          : t('cycleInsights.trackMoreCycles'),
        icon: 'trending-up-outline',
        color: actualCycleLengths.length >= 2
          ? (consistencyScore >= 80 ? '#4CAF50' : consistencyScore >= 60 ? '#FF9800' : '#FF7043')
          : '#999'
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

    // Calculate actual cycle lengths
    const actualCycleLengths = calculateActualCycleLengths();
    
    // Use average of actual cycle lengths if available, otherwise fallback to configured cycle length
    const avgCycleLength = actualCycleLengths.length > 0
      ? actualCycleLengths.reduce((acc, length) => acc + length, 0) / actualCycleLengths.length
      : (menstrualData.cycleLength || 28);

    const lastPeriodDate = new Date(menstrualData.lastPeriod);
    
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

  // Reload data function
  const reloadData = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        fetchMenstrualData(),
        fetchPeriodHistory(),
        fetchSymptoms()
      ]);
    } catch (error) {
      console.error('Error reloading data:', error);
    } finally {
      setRefreshing(false);
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
        status: period.cycleLength && period.cycleLength >= 21 && period.cycleLength <= 35 ? t('periodTracker.regular') : t('periodTracker.irregular'),
        color: period.cycleLength && period.cycleLength >= 21 && period.cycleLength <= 35 ? '#4CAF50' : '#FF7043'
      };
  });

  // Show loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>{t('cycleInsights.loadingInsights')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('cycleInsights.cycleInsights')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.reloadButton}
            onPress={reloadData}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#e91e63" />
            ) : (
              <Ionicons name="reload" size={24} color="#e91e63" />
            )}
          </TouchableOpacity>
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
            <Text style={styles.setupTitle}>{t('cycleInsights.noCycleDataYet')}</Text>
          </View>
          <Text style={styles.setupText}>
            {t('cycleInsights.startTrackingText')}
          </Text>
        </View>
      ) : (
        <>
          {/* Key Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('cycleInsights.keyInsights')}</Text>
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
                <Text style={styles.emptyStateText}>{t('cycleInsights.notEnoughData')}</Text>
                <Text style={styles.emptyStateSubtext}>{t('cycleInsights.trackMoreCycles')}</Text>
              </View>
            )}
          </View>

          {/* Cycle History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('cycleInsights.cycleHistory')}</Text>
            {cycleData.length > 0 ? (
              <View style={styles.historyCard}>
                {cycleData.map((cycle, index) => (
                  <View key={index} style={styles.historyRow}>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyMonth}>{cycle.month}</Text>
                      <Text style={styles.historyDays}>{t('cycleInsights.days')} {cycle.days}</Text>
                    </View>
                    <View style={styles.historyStats}>
                      <Text style={styles.historyLength}>{cycle.length} {t('insights.days')}</Text>
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
                <Text style={styles.emptyStateText}>{t('cycleInsights.noCycleHistoryYet')}</Text>
                <Text style={styles.emptyStateSubtext}>{t('cycleInsights.startLoggingPeriods')}</Text>
              </View>
            )}
          </View>

          {/* Predictions */}
          {predictions.nextPeriod && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('cycleInsights.predictions')}</Text>
              <View style={styles.predictionCard}>
                <View style={styles.predictionItem}>
                  <Ionicons name="calendar" size={20} color="#e91e63" />
                  <View style={styles.predictionContent}>
                    <Text style={styles.predictionTitle}>{t('cycleInsights.nextPeriod')}</Text>
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
                      <Text style={styles.predictionTitle}>{t('cycleInsights.fertileWindow')}</Text>
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
                      <Text style={styles.predictionTitle}>{t('cycleInsights.ovulation')}</Text>
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
            <Text style={styles.sectionTitle}>{t('cycleInsights.healthRecommendations')}</Text>
            <View style={styles.recommendationCard}>
              <Ionicons name="bulb-outline" size={24} color="#FFC107" />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{t('cycleInsights.stayHydrated')}</Text>
                <Text style={styles.recommendationText}>
                  {t('cycleInsights.stayHydratedDesc')}
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
    gap: 12,
  },
  reloadButton: {
    padding: 8,
    justifyContent: 'center',
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

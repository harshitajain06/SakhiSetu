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
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [calculationDetails, setCalculationDetails] = useState(null);

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
        // Sanity check: cycle should be between 14-90 days
        // Minimum 14 days to filter out same-month entries or data entry errors
        // Maximum 90 days to filter out unrealistic gaps
        if (daysDiff >= 14 && daysDiff < 90) {
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
    let calculationDetails = null;
    
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
      
      // Store calculation details for display
      calculationDetails = {
        cycleLengths: actualCycleLengths,
        mean: mean,
        variance: variance,
        stdDev: stdDev,
        coefficientOfVariation: coefficientOfVariation,
        consistencyScore: consistencyScore,
        formula: 'Score = 100 - (CV × 500)',
        cvFormula: 'CV = Standard Deviation / Mean'
      };
    } else if (actualCycleLengths.length === 1) {
      // With only one cycle, we can't calculate consistency, but we can give a neutral score
      consistencyScore = 50;
      calculationDetails = {
        cycleLengths: actualCycleLengths,
        mean: avgCycleLength,
        message: 'Need at least 2 cycles to calculate consistency'
      };
    } else {
      // No cycle data available
      consistencyScore = 0;
      calculationDetails = {
        message: 'No cycle data available'
      };
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
          : '#999',
        calculationDetails: calculationDetails,
        isClickable: actualCycleLengths.length >= 2
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
  
  // Group periods by month and year
  const groupedCycleData = periodHistory.reduce((acc, period) => {
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    
    // Check if dates are valid
    const isValidStart = !isNaN(startDate.getTime());
    const isValidEnd = !isNaN(endDate.getTime());
    
    if (!isValidStart) return acc;
    
    // Create a key for month and year (e.g., "January 2024")
    const monthKey = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Initialize the month group if it doesn't exist
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        dates: [],
        periods: []
      };
    }
    
    // Add the date range to the month group
    if (isValidStart && isValidEnd) {
      acc[monthKey].dates.push(`${startDate.getDate()}-${endDate.getDate()}`);
    } else if (isValidStart) {
      acc[monthKey].dates.push(`${startDate.getDate()}`);
    }
    
    // Store period info for status calculation
    acc[monthKey].periods.push(period);
    
    return acc;
  }, {});
  
  // Convert grouped data to array and format for display
  const cycleData = Object.values(groupedCycleData).map(group => {
    // Determine status based on periods in this month (use first period's cycle length or calculate average)
    const avgCycleLength = group.periods.reduce((sum, p) => sum + (p.cycleLength || 0), 0) / group.periods.length;
    const isRegular = avgCycleLength >= 21 && avgCycleLength <= 35;
    
      return {
      month: group.month,
      days: group.dates.join(', '), // Join all dates with comma
      length: avgCycleLength > 0 ? avgCycleLength.toFixed(0) : 'Unknown',
      status: isRegular ? t('periodTracker.regular') : t('periodTracker.irregular'),
      color: isRegular ? '#4CAF50' : '#FF7043'
    };
  }).sort((a, b) => {
    // Sort by month/year (most recent first)
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateB - dateA;
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
                {insights.map((insight, index) => {
                  const isConsistencyScore = insight.title === t('cycleInsights.consistencyScore');
                  const CardComponent = isConsistencyScore && insight.isClickable ? TouchableOpacity : View;
                  
                  return (
                    <CardComponent
                      key={index}
                      style={[styles.insightCard, isConsistencyScore && insight.isClickable && styles.clickableCard]}
                      onPress={isConsistencyScore && insight.isClickable ? () => {
                        setCalculationDetails(insight.calculationDetails);
                        setShowCalculationModal(true);
                      } : undefined}
                      activeOpacity={isConsistencyScore && insight.isClickable ? 0.7 : 1}
                    >
                    <View style={styles.insightHeader}>
                      <Ionicons name={insight.icon} size={24} color={insight.color} />
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                        {isConsistencyScore && insight.isClickable && (
                          <Ionicons name="information-circle-outline" size={18} color={insight.color} style={styles.infoIcon} />
                        )}
                    </View>
                    <Text style={styles.insightValue}>{insight.value}</Text>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                    </CardComponent>
                  );
                })}
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

      {/* Calculation Details Modal */}
      <Modal
        visible={showCalculationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalculationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calculationModalContent}>
            <View style={styles.calculationModalHeader}>
              <Text style={styles.calculationModalTitle}>
                {t('cycleInsights.consistencyScore')} {t('cycleInsights.calculationDetails') || 'Calculation Details'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowCalculationModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.calculationScrollView}>
              {calculationDetails && calculationDetails.cycleLengths ? (
                <>
                  {/* Cycle Lengths */}
                  <View style={styles.calculationSection}>
                    <Text style={styles.calculationSectionTitle}>1. Cycle Lengths (Days)</Text>
                    <View style={styles.cycleLengthsContainer}>
                      {calculationDetails.cycleLengths.map((length, index) => (
                        <View key={index} style={styles.cycleLengthBadge}>
                          <Text style={styles.cycleLengthText}>{length}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.calculationNote}>
                      Calculated from consecutive period start dates
                    </Text>
                  </View>

                  {/* Mean */}
                  <View style={styles.calculationSection}>
                    <Text style={styles.calculationSectionTitle}>2. Average Cycle Length</Text>
                    <Text style={styles.calculationFormula}>
                      Mean = Σ(Cycle Lengths) / n
                    </Text>
                    <Text style={styles.calculationValue}>
                      = ({calculationDetails.cycleLengths.join(' + ')}) / {calculationDetails.cycleLengths.length}
                    </Text>
                    <Text style={styles.calculationResult}>
                      = {calculationDetails.mean.toFixed(2)} days
                    </Text>
                  </View>

                  {/* Variance */}
                  <View style={styles.calculationSection}>
                    <Text style={styles.calculationSectionTitle}>3. Variance</Text>
                    <Text style={styles.calculationFormula}>
                      Variance = Σ((Cycle Length - Mean)²) / n
                    </Text>
                    <View style={styles.calculationSteps}>
                      {calculationDetails.cycleLengths.map((length, index) => {
                        const diff = (length - calculationDetails.mean).toFixed(2);
                        const squared = Math.pow(length - calculationDetails.mean, 2).toFixed(2);
                        return (
                          <Text key={index} style={styles.calculationValue}>
                            ({length} - {calculationDetails.mean.toFixed(2)})² = ({diff})² = {squared}
                          </Text>
                        );
                      })}
                    </View>
                    <Text style={styles.calculationValue}>
                      Sum = {calculationDetails.cycleLengths.reduce((acc, length) => 
                        acc + Math.pow(length - calculationDetails.mean, 2), 0
                      ).toFixed(2)}
                    </Text>
                    <Text style={styles.calculationValue}>
                      Variance = {calculationDetails.cycleLengths.reduce((acc, length) => 
                        acc + Math.pow(length - calculationDetails.mean, 2), 0
                      ).toFixed(2)} / {calculationDetails.cycleLengths.length}
                    </Text>
                    <Text style={styles.calculationResult}>
                      = {calculationDetails.variance.toFixed(2)}
                    </Text>
                  </View>

                  {/* Standard Deviation */}
                  <View style={styles.calculationSection}>
                    <Text style={styles.calculationSectionTitle}>4. Standard Deviation</Text>
                    <Text style={styles.calculationFormula}>
                      StdDev = √Variance
                    </Text>
                    <Text style={styles.calculationValue}>
                      = √{calculationDetails.variance.toFixed(2)}
                    </Text>
                    <Text style={styles.calculationResult}>
                      = {calculationDetails.stdDev.toFixed(2)} days
                    </Text>
                  </View>

                  {/* Coefficient of Variation */}
                  <View style={styles.calculationSection}>
                    <Text style={styles.calculationSectionTitle}>5. Coefficient of Variation (CV)</Text>
                    <Text style={styles.calculationFormula}>
                      {calculationDetails.cvFormula}
                    </Text>
                    <Text style={styles.calculationValue}>
                      = {calculationDetails.stdDev.toFixed(2)} / {calculationDetails.mean.toFixed(2)}
                    </Text>
                    <Text style={styles.calculationResult}>
                      = {(calculationDetails.coefficientOfVariation * 100).toFixed(2)}%
                    </Text>
                    <Text style={styles.calculationNote}>
                      Lower CV = Higher Consistency
                    </Text>
                  </View>

                  {/* Consistency Score */}
                  <View style={styles.calculationSection}>
                    <Text style={styles.calculationSectionTitle}>6. Consistency Score</Text>
                    <Text style={styles.calculationFormula}>
                      {calculationDetails.formula}
                    </Text>
                    <Text style={styles.calculationValue}>
                      = 100 - ({(calculationDetails.coefficientOfVariation * 100).toFixed(2)}% × 500)
                    </Text>
                    <Text style={styles.calculationValue}>
                      = 100 - {(calculationDetails.coefficientOfVariation * 500).toFixed(2)}
                    </Text>
                    <Text style={[styles.calculationResult, styles.finalScore]}>
                      = {calculationDetails.consistencyScore.toFixed(0)}%
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.calculationSection}>
                  <Text style={styles.calculationNote}>
                    {calculationDetails?.message || 'No calculation data available'}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowCalculationModal(false)}
            >
              <Text style={styles.closeModalButtonText}>
                {t('common.close') || 'Close'}
              </Text>
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
  clickableCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoIcon: {
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculationModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  calculationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calculationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  calculationScrollView: {
    maxHeight: 400,
  },
  calculationSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  calculationSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  calculationFormula: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  calculationValue: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  calculationSteps: {
    marginVertical: 8,
  },
  calculationResult: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e91e63',
    marginTop: 8,
  },
  finalScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  calculationNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  cycleLengthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  cycleLengthBadge: {
    backgroundColor: '#e91e63',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cycleLengthText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: '#e91e63',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

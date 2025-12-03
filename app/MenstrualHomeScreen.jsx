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
import { useTranslation } from '../contexts/TranslationContext';

export default function MenstrualHomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
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
        <Text style={styles.loadingText}>{t('menstrualHome.loadingData')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('menstrualHome.menstrualHealth')}</Text>
        <View style={styles.headerRight}>
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
            <Text style={styles.statusTitle}>{t('menstrualHome.currentCycle')}</Text>
          </View>
          <Text style={styles.statusText}>{t('menstrualHome.dayOf', { day: currentCycleDay, length: menstrualData.cycleLength })}</Text>
          <Text style={styles.statusSubtext}>
            {daysUntilNextPeriod > 0 
              ? t('menstrualHome.nextPeriodIn', { days: daysUntilNextPeriod })
              : t('menstrualHome.periodDue')
            }
          </Text>
        </View>
      ) : (
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <Ionicons name="heart" size={24} color="#e91e63" />
            <Text style={styles.setupTitle}>{t('menstrualHome.welcomeTitle')}</Text>
          </View>
          <Text style={styles.setupText}>
            {t('menstrualHome.setupText')}
          </Text>
          <TouchableOpacity style={styles.setupButton} onPress={navigateToTracker}>
            <Text style={styles.setupButtonText}>{t('menstrualHome.setupButton')}</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('menstrualHome.quickActions')}</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToTracker}>
            <View style={styles.actionHeader}>
              <Ionicons name="add-circle-outline" size={32} color="#e91e63" />
              <InformationIcon 
                info={t('menstrualHome.logPeriodInfo')}
                size={16}
                color="#e91e63"
                title={t('menstrualHome.logPeriod')}
              />
            </View>
            <Text style={styles.actionText}>{t('menstrualHome.logPeriod')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToTracker}>
            <View style={styles.actionHeader}>
              <Ionicons name="medical-outline" size={32} color="#e91e63" />
              <InformationIcon 
                info={t('menstrualHome.logSymptomsInfo')}
                size={16}
                color="#e91e63"
                title={t('menstrualHome.logSymptoms')}
              />
            </View>
            <Text style={styles.actionText}>{t('menstrualHome.logSymptoms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToInsights}>
            <Ionicons name="analytics-outline" size={32} color="#e91e63" />
            <Text style={styles.actionText}>{t('menstrualHome.insights')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('menstrualHome.recentActivity')}</Text>
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
                    {t('menstrualHome.periodLoggedFor')} {isValidStart ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}-{isValidEnd ? endDate.toLocaleDateString('en-US', { day: 'numeric' }) : 'Unknown'}
                  </Text>
                  <Text style={styles.activityTime}>
                    {isValidStart ? t('menstrualHome.daysAgo', { days: Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) }) : t('menstrualHome.daysAgo', { days: 0 })}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.activityItem}>
              <Ionicons name="information-circle" size={20} color="#666" />
              <Text style={styles.activityText}>{t('menstrualHome.noRecentActivity')}</Text>
              <Text style={styles.activityTime}>{t('menstrualHome.startTracking')}</Text>
            </View>
          )}
          
          {symptoms.length > 0 && (
            <View style={styles.activityItem}>
              <Ionicons name="medical" size={20} color="#FF9800" />
              <Text style={styles.activityText}>
                {symptoms[0].symptoms?.join(', ') || t('menstrualHome.symptomsLogged')}
              </Text>
              <Text style={styles.activityTime}>
                {t('menstrualHome.daysAgo', { days: Math.floor((new Date() - new Date(symptoms[0].date)) / (1000 * 60 * 60 * 24)) })}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Cycle Insights Preview */}
      {menstrualData.isSetup && periodHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('menstrualHome.cycleInsights')}</Text>
          <View style={styles.insightsPreview}>
            <View style={styles.insightItem}>
              <Ionicons name="calendar" size={20} color="#e91e63" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{t('menstrualHome.averageCycleLength')}</Text>
                <Text style={styles.insightValue}>
                  {Math.round(periodHistory.reduce((acc, period) => acc + period.cycleLength, 0) / periodHistory.length)} {t('insights.days')}
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="time" size={20} color="#2196F3" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{t('menstrualHome.averagePeriodLength')}</Text>
                <Text style={styles.insightValue}>
                  {Math.round(periodHistory.reduce((acc, period) => acc + period.periodLength, 0) / periodHistory.length)} {t('insights.days')}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton} onPress={navigateToInsights}>
            <Text style={styles.viewMoreText}>{t('menstrualHome.viewDetailedInsights')}</Text>
            <Ionicons name="arrow-forward" size={16} color="#e91e63" />
          </TouchableOpacity>
        </View>
      )}

      {/* Health Tips Carousel */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>{t('menstrualHome.healthTipsForYou')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsCarousel}>
          {/* Menstrual Tips */}
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="trash-outline" size={40} color="#E91E63" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.disposeSafely')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.disposeSafelyDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="calendar" size={40} color="#E91E63" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.trackYourCycle')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.trackYourCycleDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="moon" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.restWell')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.restWellDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="nutrition" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.eatHealthy')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.eatHealthyDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="thermometer" size={40} color="#FF5722" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.easeCramps')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.easeCrampsDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="fitness" size={40} color="#2196F3" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.exerciseTiming')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.exerciseTimingDesc')}</Text>
          </View>

          {/* Maternal Tips */}
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="restaurant" size={40} color="#8BC34A" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.eatHealthy')}</Text>
            <Text style={styles.tipDescription}>{t('home.nutritionTip')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="time" size={40} color="#FF5722" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.regularCheckups')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.regularCheckupsDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="walk" size={40} color="#607D8B" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.stayActive')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.stayActiveDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="moon" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.restWell')}</Text>
            <Text style={styles.tipDescription}>{t('home.sleepTip')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="happy" size={40} color="#FF9800" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.manageStress')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.manageStressDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="medical" size={40} color="#E91E63" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.postnatalVisits')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.postnatalVisitsDesc')}</Text>
          </View>

          {/* General Health Tips */}
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="fitness" size={40} color="#2196F3" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.exerciseRegularly')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.exerciseRegularlyDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="moon" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.getEnoughSleep')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.getEnoughSleepDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="phone-portrait-outline" size={40} color="#795548" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.limitScreenTime')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.limitScreenTimeDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="body-outline" size={40} color="#607D8B" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.practiceGoodPosture')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.practiceGoodPostureDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="tooth-outline" size={40} color="#00BCD4" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.oralCare')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.oralCareDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="water" size={40} color="#00BCD4" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.personalHygiene')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.personalHygieneDesc')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="leaf-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>{t('menstrualHome.safeEnvironment')}</Text>
            <Text style={styles.tipDescription}>{t('menstrualHome.safeEnvironmentDesc')}</Text>
          </View>
        </ScrollView>
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
    width: '100%',
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
  tipsSection: {
    marginBottom: 20,
  },
  tipsCarousel: {
    paddingLeft: 16,
  },
  tipCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

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
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

const { width } = Dimensions.get('window');

export default function MaternalHealthHomeScreen() {
  const navigation = useNavigation();
  const [pregnancyData, setPregnancyData] = useState({
    dueDate: null,
    lastPeriod: null,
    weightGain: 0,
    bloodPressure: '120/80',
    lastCheckup: null,
    isSetup: false
  });
  const [weightHistory, setWeightHistory] = useState([]);
  const [bpHistory, setBPHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get current user ID
  const getCurrentUserId = () => {
    return auth.currentUser?.uid;
  };

  // Calculate current week from due date
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

  // Calculate current trimester
  const calculateCurrentTrimester = (week) => {
    if (week <= 12) return 1;
    if (week <= 28) return 2;
    return 3;
  };

  // Calculate days until due date
  const calculateDaysUntilDue = () => {
    if (!pregnancyData.dueDate) return 0;
    const dueDate = new Date(pregnancyData.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get baby size based on week
  const getBabySize = (week) => {
    if (week <= 12) return 'Lime';
    if (week <= 20) return 'Avocado';
    if (week <= 28) return 'Cauliflower';
    return 'Pumpkin';
  };

  // Get baby development based on week
  const getBabyDevelopment = (week) => {
    if (week >= 1 && week <= 4) {
      return "Fertilization occurs, and the blastocyst implants in the uterine lining.";
    } else if (week >= 5 && week <= 8) {
      return "The heart begins to form and beat by week 7. Tiny buds that will become arms and legs start to develop. Facial features and major organs begin to form.";
    } else if (week >= 9 && week <= 12) {
      return "The fetus develops a more mature face, and eyelids form but remain closed. Fingernails begin to form. By week 12, the fetus can make a fist and begins to make minor movements, though they are not noticeable to the mother yet.";
    } else if (week >= 13 && week <= 17) {
      return "Bones begin to harden, especially in the skull and long bones. The baby starts making sucking motions and swallowing amniotic fluid. Hearing develops.";
    } else if (week >= 18 && week <= 20) {
      return "The initial signs of movement, known as \"quickening,\" may be felt. The ears are standing out, and the baby may respond to sounds.";
    } else if (week >= 21 && week <= 27) {
      return "The fetus continues to develop its brain and starts responding more to sound. Lungs are forming, and the baby is growing rapidly.";
    } else if (week >= 28 && week <= 32) {
      return "The fetus's brain and central nervous system are maturing and gaining more control over bodily functions. Rhythmic breathing movements occur, and the baby is putting on weight.";
    } else if (week >= 33 && week <= 36) {
      return "The baby continues to gain weight, adding about an ounce a day in the final weeks. Movements may become more frequent, though there is less room to somersault.";
    } else if (week >= 37 && week <= 42) {
      return "The fetus's brain and lungs are nearly fully mature. The baby's grasp is firm, and it is preparing for birth.";
    }
    return "Continue monitoring your baby's development with regular checkups.";
  };

  // Get symptoms faced by mother based on week
  const getMotherSymptoms = (week) => {
    if (week >= 1 && week <= 4) {
      return [
        "Missed period",
        "Tender, swollen breasts",
        "Fatigue",
        "Frequent urination",
        "Light spotting (implantation bleeding)",
        "Mood swings"
      ];
    } else if (week >= 5 && week <= 8) {
      return [
        "Morning sickness (nausea with or without vomiting)",
        "Heightened sense of smell",
        "More pronounced mood swings",
        "Increased fatigue",
        "Frequent urination"
      ];
    } else if (week >= 9 && week <= 12) {
      return [
        "Morning sickness and fatigue may continue",
        "Heartburn may begin",
        "You might start needing maternity clothes",
        "Breasts continue to grow"
      ];
    } else if (week >= 13 && week <= 18) {
      return [
        "You may feel better as early pregnancy symptoms lessen",
        "Weight gain becomes more regular",
        "Breasts continue to grow in preparation for milk production",
        "Heartburn can persist"
      ];
    } else if (week >= 19 && week <= 27) {
      return [
        "Swelling may increase",
        "Aches and pains in the abdomen or back are common",
        "You may feel the baby's first movements (quickening)",
        "Start sleeping on your side to prevent pressure on major veins"
      ];
    } else if (week >= 28 && week <= 34) {
      return [
        "Shortness of breath may occur as the baby grows larger",
        "Heartburn may continue or worsen",
        "Swelling in hands, feet, and ankles",
        "Pelvic discomfort can become more frequent"
      ];
    } else if (week >= 35 && week <= 42) {
      return [
        "The baby drops lower into your pelvis in preparation for birth",
        "You may have a surge in nesting instincts",
        "Frequent urination and insomnia can continue",
        "Braxton Hicks contractions may become more frequent"
      ];
    }
    return ["Consult with your healthcare provider for personalized guidance"];
  };

  // Get milestones based on current week
  const getMilestones = (week) => {
    const milestones = [];
    if (week >= 8) milestones.push('Heartbeat detectable');
    if (week >= 12) milestones.push('First trimester screening');
    if (week >= 16) milestones.push('Gender reveal possible');
    if (week >= 20) milestones.push('Anatomy scan');
    if (week >= 24) milestones.push('Viability milestone');
    if (week >= 28) milestones.push('Third trimester begins');
    return milestones;
  };

  // Fetch pregnancy data from Firestore
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch weight history
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

  // Fetch blood pressure history
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

  // Fetch appointments
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

  // Reload all data
  const reloadData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchPregnancyData(),
        fetchWeightHistory(),
        fetchBPHistory(),
        fetchAppointments()
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
      await Promise.all([
        fetchPregnancyData(),
        fetchWeightHistory(),
        fetchBPHistory(),
        fetchAppointments()
      ]);
    };
    
    loadData();
  }, []);

  // Calculate derived data
  const currentWeek = calculateCurrentWeek();
  const currentTrimester = calculateCurrentTrimester(currentWeek);
  const daysUntilDue = calculateDaysUntilDue();
  const babySize = getBabySize(currentWeek);
  const milestones = getMilestones(currentWeek);
  const babyDevelopment = getBabyDevelopment(currentWeek);
  const motherSymptoms = getMotherSymptoms(currentWeek);

  // Get latest weight and blood pressure
  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const latestBP = bpHistory.length > 0 ? bpHistory[0] : null;
  const nextAppointment = appointments.length > 0 ? appointments[0] : null;

  // Navigation handlers
  const navigateToPregnancyTracker = () => {
    navigation.navigate('Insights');
  };

  const navigateToCommunity = () => {
    navigation.navigate('Community');
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Loading your pregnancy data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sakhi Setu</Text>
          <Text style={styles.headerSubtitle}>Your Maternal Health Companion</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.reloadButton} 
            onPress={reloadData}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons 
                name="reload-outline" 
                size={24} 
                color="#fff" 
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        </View>
      </View>

      {/* Pregnancy Progress Card */}
      {pregnancyData.isSetup ? (
        <View style={styles.pregnancyCard}>
          <View style={styles.pregnancyHeader}>
            <View style={styles.pregnancyIcon}>
              <Ionicons name="heart" size={32} color="#fff" />
            </View>
            <View style={styles.pregnancyInfo}>
              <Text style={styles.pregnancyTitle}>Pregnancy Progress</Text>
              <Text style={styles.pregnancyWeek}>Week {currentWeek}</Text>
              <Text style={styles.pregnancyTrimester}>Trimester {currentTrimester}</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentWeek / 40) * 100}%` }]} />
      </View>

          <View style={styles.babyInfo}>
            <Text style={styles.babySizeText}>Your baby is the size of a {babySize}</Text>
            <View style={styles.milestonesContainer}>
              {milestones.map((milestone, index) => (
                <View key={index} style={styles.milestoneItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.milestoneText}>{milestone}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <Ionicons name="heart" size={32} color="#E91E63" />
            <Text style={styles.setupTitle}>Welcome to Your Pregnancy Journey</Text>
          </View>
          <Text style={styles.setupText}>
            Set up your pregnancy tracker to get personalized insights and track your progress.
          </Text>
          <TouchableOpacity style={styles.setupButton} onPress={navigateToPregnancyTracker}>
            <Text style={styles.setupButtonText}>Set Up Pregnancy Tracker</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Baby Development & Mother Symptoms */}
      {pregnancyData.isSetup && (
        <>
          <View style={styles.developmentCard}>
            <View style={styles.developmentHeader}>
              <Ionicons name="heart-circle" size={28} color="#E91E63" />
              <Text style={styles.developmentTitle}>Baby's Development</Text>
            </View>
            <Text style={styles.developmentWeek}>Week {currentWeek}</Text>
            <Text style={styles.developmentText}>{babyDevelopment}</Text>
          </View>

          <View style={styles.symptomsCard}>
            <View style={styles.symptomsHeader}>
              <Ionicons name="fitness" size={28} color="#9C27B0" />
              <Text style={styles.symptomsTitle}>Symptoms You May Experience</Text>
            </View>
            <View style={styles.symptomsList}>
              {motherSymptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomItem}>
                  <Ionicons name="ellipse" size={8} color="#9C27B0" />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Quick Stats */}
      {pregnancyData.isSetup && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>{Math.max(0, daysUntilDue)}</Text>
            <Text style={styles.statLabel}>Days to Go</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>{latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : 'N/A'}</Text>
            <Text style={styles.statLabel}>Blood Pressure</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="scale" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>+{pregnancyData.weightGain}</Text>
            <Text style={styles.statLabel}>Weight Gain (kg)</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="medical" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
        </View>
      )}

      {/* Today's Focus */}
      <View style={styles.focusCard}>
        <View style={styles.focusHeader}>
          <Ionicons name="star" size={24} color="#FFC107" />
          <Text style={styles.focusTitle}>Today's Focus</Text>
        </View>
        <View style={styles.focusContent}>
          {nextAppointment ? (
            <>
              <Text style={styles.focusMainText}>Upcoming Appointment</Text>
              <Text style={styles.focusSubText}>
                {nextAppointment.type} with {nextAppointment.doctor}
              </Text>
              <Text style={styles.focusDateText}>
                {new Date(nextAppointment.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })} at {nextAppointment.time}
            </Text>
              <TouchableOpacity style={styles.focusButton} onPress={navigateToPregnancyTracker}>
                <Text style={styles.focusButtonText}>View Details</Text>
                <Ionicons name="calendar" size={16} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.focusMainText}>Prenatal Yoga & Meditation</Text>
              <Text style={styles.focusSubText}>15 minutes of gentle stretching and breathing exercises</Text>
              <TouchableOpacity style={styles.focusButton}>
                <Text style={styles.focusButtonText}>Start Session</Text>
                <Ionicons name="play" size={16} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Health Tips Carousel */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Health Tips for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsCarousel}>
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="nutrition" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Nutrition</Text>
            <Text style={styles.tipDescription}>Focus on folate-rich foods like leafy greens and citrus fruits</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="fitness" size={40} color="#2196F3" />
            </View>
            <Text style={styles.tipTitle}>Exercise</Text>
            <Text style={styles.tipDescription}>30 minutes of moderate activity daily supports healthy pregnancy</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="moon" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.tipTitle}>Sleep</Text>
            <Text style={styles.tipDescription}>Aim for 7-9 hours of quality sleep for optimal recovery</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="water" size={40} color="#00BCD4" />
            </View>
            <Text style={styles.tipTitle}>Hydration</Text>
            <Text style={styles.tipDescription}>Drink 8-10 glasses of water daily to support increased blood volume</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="happy" size={40} color="#FF9800" />
            </View>
            <Text style={styles.tipTitle}>Mental Health</Text>
            <Text style={styles.tipDescription}>Practice mindfulness and stress management techniques daily</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="shield" size={40} color="#795548" />
            </View>
            <Text style={styles.tipTitle}>Prenatal Vitamins</Text>
            <Text style={styles.tipDescription}>Take your prenatal vitamins consistently for optimal nutrition</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="walk" size={40} color="#607D8B" />
            </View>
            <Text style={styles.tipTitle}>Posture</Text>
            <Text style={styles.tipDescription}>Maintain good posture and use proper body mechanics</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="thermometer" size={40} color="#E91E63" />
            </View>
            <Text style={styles.tipTitle}>Temperature</Text>
            <Text style={styles.tipDescription}>Avoid hot tubs and saunas to prevent overheating</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="restaurant" size={40} color="#8BC34A" />
            </View>
            <Text style={styles.tipTitle}>Food Safety</Text>
            <Text style={styles.tipDescription}>Avoid raw fish, unpasteurized dairy, and deli meats</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="time" size={40} color="#FF5722" />
            </View>
            <Text style={styles.tipTitle}>Regular Checkups</Text>
            <Text style={styles.tipDescription}>Attend all scheduled prenatal appointments for monitoring</Text>
          </View>
        </ScrollView>
      </View>

      {/* Community Support */}
      <View style={styles.communityCard}>
        <View style={styles.communityHeader}>
          <Ionicons name="people" size={24} color="#E91E63" />
          <Text style={styles.communityTitle}>Community Support</Text>
        </View>
        <Text style={styles.communityDescription}>
          Connect with other expecting mothers and share your journey
        </Text>
        <View style={styles.communityStats}>
          <View style={styles.communityStat}>
            <Text style={styles.communityNumber}>2.5k</Text>
            <Text style={styles.communityLabel}>Active Members</Text>
          </View>
          <View style={styles.communityStat}>
            <Text style={styles.communityNumber}>156</Text>
            <Text style={styles.communityLabel}>New Posts Today</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.communityButton} onPress={navigateToCommunity}>
          <Text style={styles.communityButtonText}>Join Community</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.emergencyCard}>
        <View style={styles.emergencyHeader}>
          <Ionicons name="call" size={24} color="#F44336" />
          <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        </View>
        <View style={styles.contactList}>
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="medical" size={20} color="#F44336" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Dr. Sarah Johnson</Text>
              <Text style={styles.contactNumber}>+1 (555) 123-4567</Text>
            </View>
            <Ionicons name="call" size={20} color="#F44336" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="medical" size={20} color="#F44336" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Emergency Line</Text>
              <Text style={styles.contactNumber}>911</Text>
            </View>
            <Ionicons name="call" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#E91E63',
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 15,
  },
  reloadButton: {
    position: 'relative',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pregnancyCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pregnancyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pregnancyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pregnancyInfo: {
    flex: 1,
  },
  pregnancyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pregnancyWeek: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 2,
  },
  pregnancyTrimester: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  babyInfo: {
    marginTop: 10,
  },
  babySizeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  milestonesContainer: {
    gap: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  milestoneText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold', 
    color: '#E91E63',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  focusCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  focusContent: {
    alignItems: 'center',
  },
  focusMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  focusSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  focusButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  focusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tipsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  tipsCarousel: {
    paddingLeft: 20,
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
  communityCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  communityStats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 30,
  },
  communityStat: {
    alignItems: 'center',
  },
  communityNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 4,
  },
  communityLabel: {
    fontSize: 12, 
    color: '#666',
  },
  communityButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  communityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emergencyCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactList: {
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 15,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  setupCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  setupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  setupText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  setupButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  focusDateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  developmentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  developmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  developmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  developmentWeek: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
    marginBottom: 12,
  },
  developmentText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  symptomsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  symptomsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  symptomsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  symptomsList: {
    gap: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingLeft: 5,
  },
  symptomText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    flex: 1,
  },
});

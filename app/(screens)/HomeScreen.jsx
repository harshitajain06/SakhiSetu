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
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';
import { useTranslation } from '../../contexts/TranslationContext';

const { width } = Dimensions.get('window');

export default function MaternalHealthHomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
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
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [sessionTime, setSessionTime] = useState(900); // 15 minutes in seconds
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const timerRef = useRef(null);

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

  // Handle phone call
  const handlePhoneCall = (phoneNumber) => {
    // Remove spaces and format for tel: scheme
    const formattedNumber = phoneNumber.replace(/\s/g, '');
    const url = `tel:${formattedNumber}`;
    Linking.openURL(url).catch(err => console.error('Error opening phone dialer:', err));
  };

  // Session timer functions
  const startSession = () => {
    setSessionModalVisible(true);
    setSessionTime(900); // Reset to 15 minutes
    setIsSessionRunning(true);
  };

  const toggleSessionTimer = () => {
    setIsSessionRunning(!isSessionRunning);
  };

  const resetSession = () => {
    setSessionTime(900);
    setIsSessionRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeSessionModal = () => {
    setIsSessionRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionModalVisible(false);
    setSessionTime(900);
  };

  // Timer effect
  useEffect(() => {
    if (isSessionRunning && sessionTime > 0) {
      timerRef.current = setInterval(() => {
        setSessionTime((prevTime) => {
          if (prevTime <= 1) {
            setIsSessionRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isSessionRunning, sessionTime]);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Session steps for each minute (15 minutes total)
  const sessionSteps = [
    { minute: 1, title: "Centering & Breathing", instruction: "Sit comfortably with your back straight. Close your eyes and take 3 deep breaths. Inhale through your nose for 4 counts, hold for 2, exhale for 6 counts." },
    { minute: 2, title: "Neck & Shoulder Release", instruction: "Slowly roll your shoulders back 5 times, then forward 5 times. Gently tilt your head to the right, hold for 15 seconds, then to the left. Repeat once more." },
    { minute: 3, title: "Gentle Spinal Warm-up", instruction: "Sit tall and gently twist your torso to the right, placing your left hand on your right knee. Hold for 20 seconds, then switch sides. Repeat once." },
    { minute: 4, title: "Cat-Cow Stretch", instruction: "Come to hands and knees. Arch your back (cow pose) on inhale, round your back (cat pose) on exhale. Repeat 8 times slowly, moving with your breath." },
    { minute: 5, title: "Modified Child's Pose", instruction: "From hands and knees, sit back on your heels (if comfortable) or keep knees slightly apart. Extend arms forward and rest forehead down. Hold for 1 minute, breathing deeply." },
    { minute: 6, title: "Hip Circles", instruction: "Come to standing or seated. Place hands on hips and slowly circle your hips clockwise 8 times, then counterclockwise 8 times. Keep movements gentle and controlled." },
    { minute: 7, title: "Standing Forward Fold (Modified)", instruction: "Stand with feet hip-width apart. Bend knees slightly and fold forward, letting your arms hang. Hold for 30 seconds, then slowly rise up. Repeat once." },
    { minute: 8, title: "Warrior II Pose (Modified)", instruction: "Step right foot forward, left foot back. Bend right knee (not past ankle), keep left leg straight. Arms out to sides, gaze over right hand. Hold 30 seconds, switch sides." },
    { minute: 9, title: "Tree Pose (Supported)", instruction: "Stand near a wall for support. Place right foot on left inner calf or thigh (avoid knee). Hands at heart center or overhead. Hold 30 seconds, switch sides." },
    { minute: 10, title: "Seated Side Stretch", instruction: "Sit with legs crossed. Inhale and raise right arm up, exhale and lean left. Hold for 30 seconds, feeling the stretch. Return to center and switch sides." },
    { minute: 11, title: "Butterfly Pose", instruction: "Sit with soles of feet together, knees out to sides. Hold your feet and gently bounce knees up and down 10 times, then hold still for 30 seconds, breathing deeply." },
    { minute: 12, title: "Legs Up the Wall (Modified)", instruction: "Sit sideways near a wall, then swing legs up the wall. If uncomfortable, use a pillow under your lower back. Rest here for 1 minute, breathing naturally." },
    { minute: 13, title: "Body Scan Meditation", instruction: "Lie down comfortably. Close your eyes and slowly scan your body from toes to head. Notice any tension and breathe into those areas. Release and relax each part." },
    { minute: 14, title: "Deep Relaxation", instruction: "Continue lying down. Focus on your breathing. With each exhale, release any remaining tension. Visualize your baby and send loving thoughts. Stay in this peaceful state." },
    { minute: 15, title: "Gratitude & Closing", instruction: "Slowly bring awareness back. Wiggle fingers and toes. Take 3 deep breaths. When ready, gently roll to your side and slowly sit up. Take a moment to feel grateful for this time." }
  ];

  // Get current step based on elapsed time
  const getCurrentStep = () => {
    const elapsedSeconds = 900 - sessionTime;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const currentMinute = Math.min(elapsedMinutes + 1, 15); // 1-15
    return sessionSteps[currentMinute - 1] || sessionSteps[0];
  };

  const currentStep = getCurrentStep();

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>{t('home.loadingData')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('home.appTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('home.subtitle')}</Text>
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
              <Text style={styles.pregnancyTitle}>{t('home.pregnancyProgress')}</Text>
              <Text style={styles.pregnancyWeek}>{t('home.week')} {currentWeek}</Text>
              <Text style={styles.pregnancyTrimester}>{t('home.trimester')} {currentTrimester}</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentWeek / 40) * 100}%` }]} />
      </View>

          <View style={styles.babyInfo}>
            <Text style={styles.babySizeText}>{t('home.babySize')} {babySize}</Text>
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
            <Text style={styles.setupTitle}>{t('home.welcomeTitle')}</Text>
          </View>
          <Text style={styles.setupText}>
            {t('home.welcomeText')}
          </Text>
          <TouchableOpacity style={styles.setupButton} onPress={navigateToPregnancyTracker}>
            <Text style={styles.setupButtonText}>{t('home.setupTracker')}</Text>
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
              <Text style={styles.developmentTitle}>{t('home.babyDevelopment')}</Text>
            </View>
            <Text style={styles.developmentWeek}>{t('home.week')} {currentWeek}</Text>
            <Text style={styles.developmentText}>{babyDevelopment}</Text>
          </View>

          <View style={styles.symptomsCard}>
            <View style={styles.symptomsHeader}>
              <Ionicons name="fitness" size={28} color="#9C27B0" />
              <Text style={styles.symptomsTitle}>{t('home.symptomsTitle')}</Text>
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
            <Text style={styles.statLabel}>{t('home.daysToGo')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>{latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : 'N/A'}</Text>
            <Text style={styles.statLabel}>{t('home.bloodPressure')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="scale" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>+{pregnancyData.weightGain}</Text>
            <Text style={styles.statLabel}>{t('home.weightGain')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="medical" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>{t('home.appointments')}</Text>
          </View>
        </View>
      )}

      {/* Upcoming Appointment - Only show when appointment exists */}
      {nextAppointment && (
        <View style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Ionicons name="calendar" size={24} color="#2196F3" />
            <Text style={styles.focusTitle}>{t('home.upcomingAppointment')}</Text>
          </View>
          <View style={styles.focusContent}>
            <Text style={styles.focusMainText}>
              {nextAppointment.type}
            </Text>
            <Text style={styles.focusSubText}>
              with {nextAppointment.doctor}
            </Text>
            <Text style={styles.focusDateText}>
              {new Date(nextAppointment.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })} at {nextAppointment.time}
            </Text>
            <TouchableOpacity style={styles.focusButton} onPress={navigateToPregnancyTracker}>
              <Text style={styles.focusButtonText}>{t('home.viewDetails')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Today's Focus - Prenatal Yoga (Always visible) */}
      <View style={styles.focusCard}>
        <View style={styles.focusHeader}>
          <Ionicons name="star" size={24} color="#FFC107" />
          <Text style={styles.focusTitle}>{t('home.todaysFocus')}</Text>
        </View>
        <View style={styles.focusContent}>
          <Text style={styles.focusMainText}>{t('home.prenatalYoga')}</Text>
          <Text style={styles.focusSubText}>{t('home.yogaDescription')}</Text>
          <TouchableOpacity style={styles.focusButton} onPress={startSession}>
            <Text style={styles.focusButtonText}>{t('home.startSession')}</Text>
            <Ionicons name="play" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Community Support */}
      <View style={styles.communityCard}>
        <View style={styles.communityHeader}>
          <Ionicons name="people" size={24} color="#E91E63" />
          <Text style={styles.communityTitle}>{t('home.communitySupport')}</Text>
        </View>
        <Text style={styles.communityDescription}>
          {t('home.communityDescription')}
        </Text>
        <View style={styles.communityStats}>
          <View style={styles.communityStat}>
            <Text style={styles.communityNumber}>2.5k</Text>
            <Text style={styles.communityLabel}>{t('home.activeMembers')}</Text>
          </View>
          <View style={styles.communityStat}>
            <Text style={styles.communityNumber}>156</Text>
            <Text style={styles.communityLabel}>{t('home.newPostsToday')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.communityButton} onPress={navigateToCommunity}>
          <Text style={styles.communityButtonText}>{t('home.joinCommunity')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.emergencyCard}>
        <View style={styles.emergencyHeader}>
          <Ionicons name="call" size={24} color="#F44336" />
          <Text style={styles.emergencyTitle}>{t('home.emergencyContacts')}</Text>
        </View>
        <View style={styles.contactList}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handlePhoneCall('+91 97179 73658')}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="medical" size={20} color="#F44336" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Womennite</Text>
              <Text style={styles.contactNumber}>+91 97179 73658</Text>
            </View>
            <Ionicons name="call" size={20} color="#F44336" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handlePhoneCall('18001034683')}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="medical" size={20} color="#F44336" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>National NGO Social Welfare</Text>
              <Text style={styles.contactNumber}>18001034683</Text>
            </View>
            <Ionicons name="call" size={20} color="#F44336" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handlePhoneCall('1091')}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="medical" size={20} color="#F44336" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Women Helpline</Text>
              <Text style={styles.contactNumber}>1091</Text>
            </View>
            <Ionicons name="call" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Tips Carousel */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>{t('home.healthTips')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsCarousel}>
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="nutrition" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>{t('home.nutrition')}</Text>
            <Text style={styles.tipDescription}>{t('home.nutritionTip')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="fitness" size={40} color="#2196F3" />
            </View>
            <Text style={styles.tipTitle}>{t('home.exercise')}</Text>
            <Text style={styles.tipDescription}>{t('home.exerciseTip')}</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="moon" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.tipTitle}>{t('home.sleep')}</Text>
            <Text style={styles.tipDescription}>{t('home.sleepTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="water" size={40} color="#00BCD4" />
            </View>
            <Text style={styles.tipTitle}>{t('home.hydration')}</Text>
            <Text style={styles.tipDescription}>{t('home.hydrationTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="happy" size={40} color="#FF9800" />
            </View>
            <Text style={styles.tipTitle}>{t('home.mentalHealth')}</Text>
            <Text style={styles.tipDescription}>{t('home.mentalHealthTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="shield" size={40} color="#795548" />
            </View>
            <Text style={styles.tipTitle}>{t('home.prenatalVitamins')}</Text>
            <Text style={styles.tipDescription}>{t('home.vitaminsTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="walk" size={40} color="#607D8B" />
            </View>
            <Text style={styles.tipTitle}>{t('home.posture')}</Text>
            <Text style={styles.tipDescription}>{t('home.postureTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="thermometer" size={40} color="#E91E63" />
            </View>
            <Text style={styles.tipTitle}>{t('home.temperature')}</Text>
            <Text style={styles.tipDescription}>{t('home.temperatureTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="restaurant" size={40} color="#8BC34A" />
            </View>
            <Text style={styles.tipTitle}>{t('home.foodSafety')}</Text>
            <Text style={styles.tipDescription}>{t('home.foodSafetyTip')}</Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImage}>
              <Ionicons name="time" size={40} color="#FF5722" />
            </View>
            <Text style={styles.tipTitle}>{t('home.regularCheckups')}</Text>
            <Text style={styles.tipDescription}>{t('home.checkupsTip')}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Session Timer Modal */}
      <Modal
        visible={sessionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSessionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('home.prenatalYoga')}</Text>
                <TouchableOpacity onPress={closeSessionModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(sessionTime)}</Text>
                <Text style={styles.timerLabel}>
                  {sessionTime === 0 ? t('home.sessionComplete') : isSessionRunning ? t('home.sessionInProgress') : t('home.sessionPaused')}
                </Text>
              </View>

              {/* Current Step Display */}
              {sessionTime < 900 && (
                <View style={styles.currentStepContainer}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepIndicator}>
                      <Text style={styles.stepNumber}>{currentStep.minute}</Text>
                    </View>
                    <Text style={styles.stepTitle}>{currentStep.title}</Text>
                  </View>
                  <Text style={styles.stepInstruction}>{currentStep.instruction}</Text>
                  <View style={styles.stepProgress}>
                    <View style={styles.stepProgressBar}>
                      <View 
                        style={[
                          styles.stepProgressFill, 
                          { width: `${(currentStep.minute / 15) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.stepProgressText}>
                      {t('home.stepOf', { current: currentStep.minute, total: 15 })}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.sessionControls}>
                <TouchableOpacity
                  style={[styles.controlButton, styles.primaryButton]}
                  onPress={toggleSessionTimer}
                  disabled={sessionTime === 0}
                >
                  <Ionicons
                    name={isSessionRunning ? 'pause' : 'play'}
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.controlButtonText}>
                    {isSessionRunning ? t('home.pause') : t('home.resume')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, styles.secondaryButton]}
                  onPress={resetSession}
                >
                  <Ionicons name="refresh" size={24} color="#E91E63" />
                  <Text style={[styles.controlButtonText, styles.secondaryButtonText]}>
                    {t('home.reset')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sessionTips}>
                <Text style={styles.sessionTipsTitle}>{t('home.sessionTips')}</Text>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipItemText}>{t('home.tip1')}</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipItemText}>{t('home.tip2')}</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.tipItemText}>{t('home.tip3')}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    color: '#2196F3',
    textDecorationLine: 'underline',
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  modalScrollContent: {
    padding: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  sessionControls: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#E91E63',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#E91E63',
  },
  sessionTips: {
    marginTop: 10,
  },
  sessionTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipItemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  currentStepContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  stepProgress: {
    marginTop: 10,
  },
  stepProgressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  stepProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  stepProgressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
});

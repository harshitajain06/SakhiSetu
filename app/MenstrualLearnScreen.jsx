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

export default function MenstrualLearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menstrualData, setMenstrualData] = useState({
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: null,
    isSetup: false
  });
  const [periodHistory, setPeriodHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'basics', name: 'Basics', icon: 'book-outline' },
    { id: 'health', name: 'Health', icon: 'medical-outline' },
    { id: 'nutrition', name: 'Nutrition', icon: 'nutrition-outline' },
    { id: 'exercise', name: 'Exercise', icon: 'fitness-outline' },
  ];

  // Dynamic articles based on user data
  const getPersonalizedArticles = () => {
    const baseArticles = [
      {
        id: 1,
        title: 'Understanding Your Menstrual Cycle',
        category: 'basics',
        readTime: '5 min read',
        difficulty: 'Beginner',
        image: '📚',
        description: 'Learn the fundamentals of your menstrual cycle and what to expect.'
      },
      {
        id: 2,
        title: 'Managing Period Pain Naturally',
        category: 'health',
        readTime: '7 min read',
        difficulty: 'Intermediate',
        image: '🌿',
        description: 'Natural remedies and techniques to ease menstrual discomfort.'
      },
      {
        id: 3,
        title: 'Nutrition During Your Period',
        category: 'nutrition',
        readTime: '6 min read',
        difficulty: 'Beginner',
        image: '🥗',
        description: 'Foods that can help with energy and mood during your cycle.'
      },
      {
        id: 4,
        title: 'Exercise and Your Cycle',
        category: 'exercise',
        readTime: '8 min read',
        difficulty: 'Intermediate',
        image: '🏃‍♀️',
        description: 'How to adapt your workout routine to your menstrual cycle.'
      },
      {
        id: 5,
        title: 'Hormonal Changes Explained',
        category: 'basics',
        readTime: '10 min read',
        difficulty: 'Advanced',
        image: '🧬',
        description: 'Understanding the science behind your menstrual cycle.'
      },
      {
        id: 6,
        title: 'Iron-Rich Foods for Women',
        category: 'nutrition',
        readTime: '4 min read',
        difficulty: 'Beginner',
        image: '🥩',
        description: 'Essential nutrients to support your menstrual health.'
      },
    ];

    // Add personalized articles based on user data
    const personalizedArticles = [];

    // If user has irregular cycles, add relevant content
    if (periodHistory.length > 0) {
      const cycleLengths = periodHistory.map(period => period.cycleLength);
      const avgCycleLength = cycleLengths.reduce((acc, length) => acc + length, 0) / cycleLengths.length;
      
      if (avgCycleLength < 21 || avgCycleLength > 35) {
        personalizedArticles.push({
          id: 7,
          title: 'Understanding Irregular Cycles',
          category: 'health',
          readTime: '6 min read',
          difficulty: 'Intermediate',
          image: '📊',
          description: 'What irregular cycles mean and when to seek medical advice.'
        });
      }
    }

    // If user has heavy periods, add relevant content
    if (periodHistory.length > 0) {
      const avgPeriodLength = periodHistory.reduce((acc, period) => acc + period.periodLength, 0) / periodHistory.length;
      
      if (avgPeriodLength > 7) {
        personalizedArticles.push({
          id: 8,
          title: 'Managing Heavy Periods',
          category: 'health',
          readTime: '5 min read',
          difficulty: 'Beginner',
          image: '💪',
          description: 'Tips for managing heavy menstrual flow and when to see a doctor.'
        });
      }
    }

    // If user has logged symptoms, add symptom management content
    if (symptoms.length > 0) {
      const commonSymptoms = symptoms.map(s => s.symptom.toLowerCase());
      if (commonSymptoms.some(s => s.includes('cramp'))) {
        personalizedArticles.push({
          id: 9,
          title: 'Natural Cramp Relief',
          category: 'health',
          readTime: '4 min read',
          difficulty: 'Beginner',
          image: '🌿',
          description: 'Natural ways to ease menstrual cramps and discomfort.'
        });
      }
    }

    return [...baseArticles, ...personalizedArticles];
  };

  const articles = getPersonalizedArticles();

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

  // Get personalized health tips based on user data
  const getPersonalizedTips = () => {
    const baseTips = [
      { icon: 'water', text: 'Stay hydrated during your period', color: '#2196F3' },
      { icon: 'restaurant', text: 'Eat iron-rich foods', color: '#4CAF50' },
      { icon: 'bed', text: 'Get adequate sleep', color: '#9C27B0' },
      { icon: 'fitness', text: 'Light exercise helps with cramps', color: '#FF9800' },
    ];

    const personalizedTips = [];

    // Add tips based on cycle patterns
    if (periodHistory.length > 0) {
      const cycleLengths = periodHistory.map(period => period.cycleLength);
      const avgCycleLength = cycleLengths.reduce((acc, length) => acc + length, 0) / cycleLengths.length;
      
      if (avgCycleLength < 21) {
        personalizedTips.push({ icon: 'medical', text: 'Short cycles may need medical attention', color: '#F44336' });
      } else if (avgCycleLength > 35) {
        personalizedTips.push({ icon: 'time', text: 'Long cycles - track consistently', color: '#FF9800' });
      }
    }

    // Add tips based on symptoms
    if (symptoms.length > 0) {
      const commonSymptoms = symptoms.map(s => s.symptom.toLowerCase());
      if (commonSymptoms.some(s => s.includes('cramp'))) {
        personalizedTips.push({ icon: 'thermometer', text: 'Heat therapy for cramps', color: '#FF5722' });
      }
      if (commonSymptoms.some(s => s.includes('bloat'))) {
        personalizedTips.push({ icon: 'leaf', text: 'Reduce salt intake for bloating', color: '#4CAF50' });
      }
    }

    return [...baseTips, ...personalizedTips];
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666';
    }
  };

  const personalizedTips = getPersonalizedTips();

  // Show loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Loading personalized content...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn</Text>
        <View style={styles.headerRight}>
          <Ionicons name="search-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Personalized Content Banner */}
      {menstrualData.isSetup && periodHistory.length > 0 && (
        <View style={styles.personalizedBanner}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.personalizedText}>
            Content personalized based on your cycle data
          </Text>
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? '#e91e63' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Article */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <TouchableOpacity style={styles.featuredCard}>
          <View style={styles.featuredImage}>
            <Text style={styles.featuredEmoji}>🌟</Text>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Complete Guide to Menstrual Health</Text>
            <Text style={styles.featuredDescription}>
              Everything you need to know about your cycle, from basics to advanced topics.
            </Text>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredReadTime}>15 min read</Text>
              <Text style={styles.featuredDifficulty}>Comprehensive</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Personalized Articles Section */}
      {articles.some(article => article.id > 6) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {articles.filter(article => article.id > 6).map((article) => (
            <TouchableOpacity key={article.id} style={[styles.articleCard, styles.personalizedCard]}>
              <View style={styles.articleImage}>
                <Text style={styles.articleEmoji}>{article.image}</Text>
              </View>
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDescription}>{article.description}</Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(article.difficulty) }]}>
                    <Text style={styles.difficultyText}>{article.difficulty}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Articles List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Articles</Text>
        {filteredArticles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <View style={styles.articleImage}>
              <Text style={styles.articleEmoji}>{article.image}</Text>
            </View>
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              {article.description && (
                <Text style={styles.articleDescription}>{article.description}</Text>
              )}
              <View style={styles.articleMeta}>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(article.difficulty) }]}>
                  <Text style={styles.difficultyText}>{article.difficulty}</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Personalized Quick Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Tips</Text>
        <View style={styles.tipsContainer}>
          {personalizedTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Ionicons name={tip.icon} size={24} color={tip.color} />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
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
  personalizedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  personalizedText: {
    fontSize: 14,
    color: '#E65100',
    marginLeft: 8,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  activeCategory: {
    backgroundColor: '#fce4ec',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: '#e91e63',
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
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 16,
  },
  featuredImage: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredEmoji: {
    fontSize: 24,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredReadTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  featuredDifficulty: {
    fontSize: 12,
    color: '#e91e63',
    fontWeight: '500',
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  personalizedCard: {
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#e91e63',
  },
  articleImage: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  articleEmoji: {
    fontSize: 20,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  tipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});

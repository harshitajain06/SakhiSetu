import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MenstrualLearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'basics', name: 'Basics', icon: 'book-outline' },
    { id: 'health', name: 'Health', icon: 'medical-outline' },
    { id: 'nutrition', name: 'Nutrition', icon: 'nutrition-outline' },
    { id: 'exercise', name: 'Exercise', icon: 'fitness-outline' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Understanding Your Menstrual Cycle',
      category: 'basics',
      readTime: '5 min read',
      difficulty: 'Beginner',
      image: '📚',
    },
    {
      id: 2,
      title: 'Managing Period Pain Naturally',
      category: 'health',
      readTime: '7 min read',
      difficulty: 'Intermediate',
      image: '🌿',
    },
    {
      id: 3,
      title: 'Nutrition During Your Period',
      category: 'nutrition',
      readTime: '6 min read',
      difficulty: 'Beginner',
      image: '🥗',
    },
    {
      id: 4,
      title: 'Exercise and Your Cycle',
      category: 'exercise',
      readTime: '8 min read',
      difficulty: 'Intermediate',
      image: '🏃‍♀️',
    },
    {
      id: 5,
      title: 'Hormonal Changes Explained',
      category: 'basics',
      readTime: '10 min read',
      difficulty: 'Advanced',
      image: '🧬',
    },
    {
      id: 6,
      title: 'Iron-Rich Foods for Women',
      category: 'nutrition',
      readTime: '4 min read',
      difficulty: 'Beginner',
      image: '🥩',
    },
  ];

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

      {/* Articles List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Articles</Text>
        {filteredArticles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <View style={styles.articleImage}>
              <Text style={styles.articleEmoji}>{article.image}</Text>
            </View>
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle}>{article.title}</Text>
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

      {/* Quick Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <Ionicons name="water" size={24} color="#2196F3" />
            <Text style={styles.tipText}>Stay hydrated during your period</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="restaurant" size={24} color="#4CAF50" />
            <Text style={styles.tipText}>Eat iron-rich foods</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="bed" size={24} color="#9C27B0" />
            <Text style={styles.tipText}>Get adequate sleep</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="fitness" size={24} color="#FF9800" />
            <Text style={styles.tipText}>Light exercise helps with cramps</Text>
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

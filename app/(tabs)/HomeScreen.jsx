import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HealthCompassHomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Compass</Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome to Your Health Journey</Text>
        <Text style={styles.welcomeText}>
          Your comprehensive health companion for wellness, community support, and personalized insights.
        </Text>
      </View>

      {/* Health Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Categories</Text>
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={[styles.card, { backgroundColor: '#3498db' }]}>
            <Ionicons name="heart-outline" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>General Health</Text>
            <Text style={styles.cardSubtitle}>
              Overall wellness, fitness, and preventive care
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Wellness</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: '#e91e63' }]}>
            <Ionicons name="flower-outline" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Menstrual Health</Text>
            <Text style={styles.cardSubtitle}>
              Period tracking, cycle insights, and specialized care
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Specialized</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: '#9b59b6' }]}>
            <Ionicons name="people-outline" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Maternal Wellness</Text>
            <Text style={styles.cardSubtitle}>
              Pregnancy support, postpartum care, and parenting resources
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: '#2ecc71' }]}>
            <Ionicons name="fitness-outline" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Mental Health</Text>
            <Text style={styles.cardSubtitle}>
              Stress management, mindfulness, and emotional wellness
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Wellness</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar-outline" size={24} color="#3498db" />
            <Text style={styles.actionText}>Health Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="medical-outline" size={24} color="#e91e63" />
            <Text style={styles.actionText}>Symptom Tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people-outline" size={24} color="#9b59b6" />
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="book-outline" size={24} color="#2ecc71" />
            <Text style={styles.actionText}>Health Library</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Health Tip</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#FFC107" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipText}>
              Drinking enough water throughout the day helps maintain energy levels, supports digestion, and keeps your skin healthy.
            </Text>
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
    padding: 16 
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
    color: '#333' 
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
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
    fontSize: 12 
  },
  welcomeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: { 
    marginBottom: 12,
    alignSelf: 'center',
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: '#fff', 
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#fff' 
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
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
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

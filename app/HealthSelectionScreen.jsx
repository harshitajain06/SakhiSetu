import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HealthSelectionScreen() {
  const navigation = useNavigation();

  const handleHealthCompass = () => {
    navigation.replace('HealthCompassTabs');
  };

  const handleMenstrualHealth = () => {
    navigation.replace('MenstrualHealthTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to SakhiSetu</Text>
          <Text style={styles.subtitleText}>Choose your health journey</Text>
        </View>

        {/* Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Health Compass Card */}
          <TouchableOpacity style={[styles.card, styles.healthCompassCard]} onPress={handleHealthCompass}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="compass-outline" size={40} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Health Compass</Text>
            <Text style={styles.cardDescription}>
              Comprehensive health resources, community support, and wellness insights
            </Text>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>General Health</Text>
            </View>
          </TouchableOpacity>

          {/* Menstrual Health Card */}
          <TouchableOpacity style={[styles.card, styles.menstrualHealthCard]} onPress={handleMenstrualHealth}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="heart-outline" size={40} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Menstrual Health</Text>
            <Text style={styles.cardDescription}>
              Period tracking, cycle insights, and specialized menstrual wellness support
            </Text>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>Specialized Care</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can switch between these options anytime from your profile
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  healthCompassCard: {
    backgroundColor: '#3498db',
  },
  menstrualHealthCard: {
    backgroundColor: '#e91e63',
  },
  cardIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  cardBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 16,
  },
});

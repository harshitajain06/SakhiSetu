import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CycleInsightsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  const cycleData = [
    { month: 'July 2025', days: '7-10', length: '28', status: 'Regular', color: '#4CAF50' },
    { month: 'June 2025', days: '9-13', length: '30', status: 'Regular', color: '#4CAF50' },
    { month: 'May 2025', days: '10-14', length: '29', status: 'Regular', color: '#4CAF50' },
    { month: 'April 2025', days: '11-15', length: '31', status: 'Irregular', color: '#FF7043' },
  ];

  const insights = [
    {
      title: 'Average Cycle Length',
      value: '29.5 days',
      description: 'Your cycles are generally regular',
      icon: 'calendar-outline',
      color: '#4CAF50'
    },
    {
      title: 'Average Period Length',
      value: '4.2 days',
      description: 'Within normal range (3-7 days)',
      icon: 'time-outline',
      color: '#2196F3'
    },
    {
      title: 'Consistency Score',
      value: '85%',
      description: 'Very consistent cycle patterns',
      icon: 'trending-up-outline',
      color: '#FF9800'
    },
  ];

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

      {/* Key Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
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
      </View>

      {/* Cycle History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cycle History</Text>
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
      </View>

      {/* Predictions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predictions</Text>
        <View style={styles.predictionCard}>
          <View style={styles.predictionItem}>
            <Ionicons name="calendar" size={20} color="#e91e63" />
            <View style={styles.predictionContent}>
              <Text style={styles.predictionTitle}>Next Period</Text>
              <Text style={styles.predictionValue}>August 5, 2025</Text>
            </View>
          </View>
          <View style={styles.predictionItem}>
            <Ionicons name="heart" size={20} color="#FF9800" />
            <View style={styles.predictionContent}>
              <Text style={styles.predictionTitle}>Fertile Window</Text>
              <Text style={styles.predictionValue}>July 22-26, 2025</Text>
            </View>
          </View>
          <View style={styles.predictionItem}>
            <Ionicons name="thermometer" size={20} color="#2196F3" />
            <View style={styles.predictionContent}>
              <Text style={styles.predictionTitle}>Ovulation</Text>
              <Text style={styles.predictionValue}>July 24, 2025</Text>
            </View>
          </View>
        </View>
      </View>

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

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function PeriodTrackerScreen() {
  const [selectedMonth, setSelectedMonth] = useState('July 2025');

  const markedDates = {
    '2025-07-07': { selected: true, selectedColor: '#e91e63' },
    '2025-07-08': { selected: true, selectedColor: '#e91e63' },
    '2025-07-09': { selected: true, selectedColor: '#e91e63' },
    '2025-07-10': { selected: true, selectedColor: '#e91e63' },
    '2025-08-05': { marked: true, dotColor: '#e91e63' },
    '2025-08-06': { marked: true, dotColor: '#e91e63' },
    '2025-08-07': { marked: true, dotColor: '#e91e63' },
    '2025-08-08': { marked: true, dotColor: '#e91e63' },
  };

  const symptoms = [
    { name: 'Cramps', severity: 'Mild', icon: 'medical-outline' },
    { name: 'Bloating', severity: 'Moderate', icon: 'water-outline' },
    { name: 'Mood', severity: 'Good', icon: 'happy-outline' },
    { name: 'Energy', severity: 'Low', icon: 'battery-half-outline' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Period Tracker</Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Current Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name="calendar" size={24} color="#e91e63" />
          <Text style={styles.statusTitle}>Next Period</Text>
        </View>
        <Text style={styles.statusText}>August 5, 2025</Text>
        <Text style={styles.statusSubtext}>In 3 days</Text>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          monthFormat={'MMMM yyyy'}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#e91e63',
            todayTextColor: '#e91e63',
            arrowColor: '#e91e63',
            monthTextColor: '#333',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
        />
      </View>

      {/* Today's Symptoms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Symptoms</Text>
        <View style={styles.symptomsGrid}>
          {symptoms.map((symptom, index) => (
            <TouchableOpacity key={index} style={styles.symptomCard}>
              <Ionicons name={symptom.icon} size={24} color="#e91e63" />
              <Text style={styles.symptomName}>{symptom.name}</Text>
              <Text style={styles.symptomSeverity}>{symptom.severity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickLogContainer}>
          <TouchableOpacity style={styles.logButton}>
            <Ionicons name="add-circle" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>Log Period Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logButton}>
            <Ionicons name="medical" size={24} color="#e91e63" />
            <Text style={styles.logButtonText}>Log Symptoms</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cycle History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Cycles</Text>
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <Text style={styles.historyMonth}>July 2025</Text>
            <Text style={styles.historyDays}>4 days</Text>
            <Text style={styles.historyStatus}>Regular</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyMonth}>June 2025</Text>
            <Text style={styles.historyDays}>5 days</Text>
            <Text style={styles.historyStatus}>Regular</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyMonth}>May 2025</Text>
            <Text style={styles.historyDays}>3 days</Text>
            <Text style={styles.historyStatus}>Light</Text>
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
  statusCard: {
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  calendarContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  symptomSeverity: {
    fontSize: 12,
    color: '#666',
  },
  quickLogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logButton: {
    flex: 1,
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e91e63',
    marginTop: 8,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyMonth: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  historyDays: {
    fontSize: 14,
    color: '#666',
  },
  historyStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

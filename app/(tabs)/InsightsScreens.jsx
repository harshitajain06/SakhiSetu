// InsightsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';

export default function InsightsScreen() {
  const [selectedMonth, setSelectedMonth] = useState('July 2025');

  const markedDates = {
    '2025-07-07': { selected: true, selectedColor: '#8E24AA' },
    '2025-07-08': { selected: true, selectedColor: '#8E24AA' },
    '2025-07-09': { selected: true, selectedColor: '#8E24AA' },
    '2025-07-10': { selected: true, selectedColor: '#8E24AA' },
  };

  const historyData = [
    { month: 'March 2025', days: '6 7 8 9', status: 'On time', color: '#4CAF50' },
    { month: 'April 2025', days: '10 11 12 13', status: 'Delayed 4 days', color: '#FF7043' },
    { month: 'May 2025', days: '6 7 8 9', status: 'On time', color: '#4CAF50' },
    { month: 'June 2025', days: '20 21 22 23', status: 'Delayed 14 days', color: '#E53935' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Period Tracker</Text>
        <View style={styles.headerRight}>
          <Icon name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>AM</Text>
          </View>
        </View>
      </View>

      {/* History */}
      {historyData.map((item, index) => (
        <View key={index} style={styles.historyRow}>
          <Text style={styles.historyMonth}>{item.month}</Text>
          <View style={styles.historyDays}>
            {item.days.split(' ').map((d, i) => (
              <View key={i} style={styles.dayCircle}>
                <Text>{d}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.statusBadge, { borderColor: item.color }]}>
            <Text style={{ color: item.color }}>{item.status}</Text>
          </View>
        </View>
      ))}

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Period Dates</Text>
      </TouchableOpacity>

      {/* Calendar */}
      <Calendar
        monthFormat={'MMMM yyyy'}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#8E24AA',
          todayTextColor: '#FFB300',
        }}
      />

      {/* Legend */}
      <View style={styles.legendBox}>
        <Text style={styles.legendTitle}>Calendar Legend</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#8E24AA' }]} />
          <Text>Period Days</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#F48FB1' }]} />
          <Text>Predicted Days</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#FFB300' }]} />
          <Text>Today</Text>
        </View>
        <View style={styles.legendRow}>
          <Icon name="notifications-outline" size={14} color="#E53935" />
          <Text>Symptoms Logged</Text>
        </View>
      </View>

      {/* Cycle Insights */}
      <View style={styles.insightsBox}>
        <Text style={styles.insightsTitle}>Cycle Insights</Text>
        <Text style={styles.insightLabel}>Average Cycle Length: <Text style={{ fontWeight: 'bold' }}>28 days</Text></Text>
        <Text style={styles.insightText}>
          Based on your tracked history. Consistency is key for accurate predictions.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center',
  },
  profileText: { fontWeight: 'bold', fontSize: 12 },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  historyMonth: { flex: 1, fontWeight: '500' },
  historyDays: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dayCircle: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, marginHorizontal: 2,
  },
  statusBadge: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 'auto',
  },
  editButton: {
    alignSelf: 'center', marginVertical: 12, paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderRadius: 8, borderColor: '#ccc',
  },
  editButtonText: { fontWeight: '500', color: '#333' },
  legendBox: {
    marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8,
  },
  legendTitle: { fontWeight: 'bold', marginBottom: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  insightsBox: {
    marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8,
  },
  insightsTitle: { fontWeight: 'bold', marginBottom: 8 },
  insightLabel: { marginBottom: 4 },
  insightText: { fontSize: 12, color: '#555' },
});

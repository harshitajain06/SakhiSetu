// HealthCompassScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HealthCompassScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Compass</Text>
        <View style={styles.headerRight}>
          <Icon name="notifications-outline" size={24} color="#333" style={{ marginRight: 16 }} />
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>HS</Text>
          </View>
        </View>
      </View>

      {/* Cards */}
      <TouchableOpacity style={[styles.card, { backgroundColor: '#F06292' }]} onPress={() => {}}>
        <Icon name="heart-outline" size={24} color="#fff" style={styles.cardIcon} />
        <Text style={styles.cardTitle}>Menstrual Health</Text>
        <Text style={styles.cardSubtitle}>
          Comprehensive resources for cycles, wellness, and more
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>New Insights</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#7986CB' }]} onPress={() => {}}>
        <Icon name="heart-outline" size={24} color="#fff" style={styles.cardIcon} />
        <Text style={styles.cardTitle}>Maternal Wellness</Text>
        <Text style={styles.cardSubtitle}>
          Support and guidance through pregnancy and postpartum
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Join Groups</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: { fontWeight: 'bold', fontSize: 12 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardIcon: { marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#fff', marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#333' },
});

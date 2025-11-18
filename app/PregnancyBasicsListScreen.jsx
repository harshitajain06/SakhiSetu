import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { pregnancyBasicsData } from './data/pregnancyBasicsData';

export default function PregnancyBasicsListScreen() {
  const navigation = useNavigation();

  const renderWeekCard = ({ item }) => (
    <TouchableOpacity
      style={styles.weekCard}
      onPress={() => navigation.navigate('PregnancyBasicsDetail', { item: item })}
      activeOpacity={0.7}
    >
      <View style={styles.weekIconContainer}>
        <Text style={styles.weekNumber}>{item.week}</Text>
      </View>
      <View style={styles.weekTextContainer}>
        <Text style={styles.weekTitle}>{item.title}</Text>
        <Text style={styles.weekTrimester}>{item.trimester} Trimester</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pregnancy Week by Week</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={pregnancyBasicsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWeekCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  listContent: {
    padding: 20,
  },
  weekCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weekIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  weekNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  weekTextContainer: {
    flex: 1,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  weekTrimester: {
    fontSize: 13,
    color: '#666',
  },
});


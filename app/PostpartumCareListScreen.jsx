import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';
import { postpartumCareData } from './data/postpartumCareData';

export default function PostpartumCareListScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const renderItemCard = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('PostpartumCareDetail', { item: item })}
      activeOpacity={0.7}
    >
      <View style={styles.itemIconContainer}>
        <Ionicons name="flower" size={24} color="#fff" />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{item.title}</Text>
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
        <Text style={styles.headerTitle}>{t('postpartumCare.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={postpartumCareData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItemCard}
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
  itemCard: {
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
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});


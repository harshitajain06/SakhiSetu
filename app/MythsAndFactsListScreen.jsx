import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';
import { mythsData } from './data/mythsData';

export default function MythsAndFactsListScreen() {
  const navigation = useNavigation();
  const { t, language } = useTranslation();

  // Helper function to get translated title
  const getTranslatedTitle = (itemId) => {
    try {
      const enTranslations = require('../contexts/translations/en').default;
      const hiTranslations = require('../contexts/translations/hi').default;
      const currentTranslations = language === 'hi' ? hiTranslations : enTranslations;
      
      const itemKey = `item${itemId}`;
      const translatedTitle = currentTranslations?.myth?.mythsItems?.[itemKey]?.title;
      return translatedTitle || mythsData.find(i => i.id === itemId)?.title || '';
    } catch (error) {
      console.log('Translation error:', error);
      return mythsData.find(i => i.id === itemId)?.title || '';
    }
  };

  const renderMythCard = ({ item }) => {
    const translatedTitle = getTranslatedTitle(item.id);
    return (
      <TouchableOpacity
        style={styles.mythCard}
        onPress={() => navigation.navigate('MythDetail', { myth: item })}
        activeOpacity={0.7}
      >
        <View style={styles.mythIconContainer}>
          <Ionicons name="help-circle" size={24} color="#fff" />
        </View>
        <View style={styles.mythTextContainer}>
          <Text style={styles.mythText}>{translatedTitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('menstrual.mythsAndFacts')}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={mythsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMythCard}
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
  mythCard: {
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
  mythIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mythTextContainer: {
    flex: 1,
  },
  mythText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});


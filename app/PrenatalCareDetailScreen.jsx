import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';

export default function PrenatalCareDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  const { t, language } = useTranslation();

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>{t('general.contentNotFound')}</Text>
      </View>
    );
  }

  // Helper function to get translated content with fallback
  const getTranslatedItem = () => {
    try {
      const enTranslations = require('../contexts/translations/en').default;
      const hiTranslations = require('../contexts/translations/hi').default;
      const currentTranslations = language === 'hi' ? hiTranslations : enTranslations;
      
      const itemKey = `item${item.id}`;
      const translatedItem = currentTranslations?.prenatalCare?.prenatalCareItems?.[itemKey];
      
      if (translatedItem) {
        return {
          title: translatedItem.title || item.title,
          content: translatedItem.content || item.content,
          tips: translatedItem.tips || item.tips || [],
          importantNote: translatedItem.importantNote || item.importantNote
        };
      }
    } catch (error) {
      console.log('Translation error:', error);
    }
    
    // Fallback to original item
    return {
      title: item.title,
      content: item.content,
      tips: item.tips || [],
      importantNote: item.importantNote
    };
  };

  const translatedItem = getTranslatedItem();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('prenatalCare.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{translatedItem.title}</Text>
      </View>

      {/* Content Section */}
      <View style={styles.section}>
        <Text style={styles.contentText}>{translatedItem.content}</Text>
      </View>

      {/* Tips Section */}
      {translatedItem.tips && translatedItem.tips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('prenatalCare.keyTips')}</Text>
          </View>
          {translatedItem.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Important Note Section */}
      {translatedItem.importantNote && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('prenatalCare.importantNote')}</Text>
          </View>
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{translatedItem.importantNote}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 30,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    marginTop: 8,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  noteContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  noteText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 40,
  },
});


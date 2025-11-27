import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';
import MythIllustration from './components/MythIllustration';

export default function MythDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { myth } = route.params || {};
  const { t, language } = useTranslation();

  if (!myth) {
    return (
      <View style={styles.container}>
        <Text>{t('myth.mythNotFound')}</Text>
      </View>
    );
  }

  // Helper function to get translated myth content with fallback
  const getTranslatedMyth = () => {
    try {
      const enTranslations = require('../contexts/translations/en').default;
      const hiTranslations = require('../contexts/translations/hi').default;
      const currentTranslations = language === 'hi' ? hiTranslations : enTranslations;
      
      const itemKey = `item${myth.id}`;
      const translatedMyth = currentTranslations?.myth?.mythsItems?.[itemKey];
      
      if (translatedMyth) {
        return {
          title: translatedMyth.title || myth.title,
          shortTitle: translatedMyth.shortTitle || myth.shortTitle,
          mythStatement: translatedMyth.mythStatement || myth.mythStatement,
          factCheck: translatedMyth.factCheck || myth.factCheck,
          scientificFacts: translatedMyth.scientificFacts || myth.scientificFacts || [],
          healthyTip: translatedMyth.healthyTip || myth.healthyTip,
          conclusion: translatedMyth.conclusion || myth.conclusion
        };
      }
    } catch (error) {
      console.log('Translation error:', error);
    }
    
    // Fallback to original myth
    return {
      title: myth.title,
      shortTitle: myth.shortTitle,
      mythStatement: myth.mythStatement,
      factCheck: myth.factCheck,
      scientificFacts: myth.scientificFacts || [],
      healthyTip: myth.healthyTip,
      conclusion: myth.conclusion
    };
  };

  const translatedMyth = getTranslatedMyth();

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
        <Text style={styles.headerTitle}>{t('myth.mythExplainer')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Myth Tag */}
      <View style={styles.mythTagContainer}>
        <View style={styles.mythTag}>
          <Text style={styles.mythTagText}>{t('myth.myth')}: {translatedMyth.shortTitle}</Text>
        </View>
      </View>

      {/* The Myth Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb" size={24} color="#FFC107" />
          <Text style={styles.sectionTitle}>{t('myth.theMyth')}</Text>
        </View>
        <Text style={styles.mythStatement}>{translatedMyth.mythStatement}</Text>
      </View>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <MythIllustration imageType={myth.imageType} />
      </View>

      {/* FACT Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>{t('myth.fact')}</Text>
        </View>
        <Text style={styles.factText}>{translatedMyth.factCheck}</Text>
      </View>

      {/* Scientific Facts Section */}
      {translatedMyth.scientificFacts && translatedMyth.scientificFacts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('myth.scientificFacts')}</Text>
          </View>
          {translatedMyth.scientificFacts.map((fact, index) => (
            <View key={index} style={styles.factItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.factItemText}>{fact}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Healthy Tip Section */}
      {translatedMyth.healthyTip && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>{t('myth.healthyTip')}</Text>
          </View>
          <Text style={styles.tipText}>{translatedMyth.healthyTip}</Text>
        </View>
      )}

      {/* Conclusion Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>{t('myth.conclusion')}</Text>
        </View>
        <Text style={styles.conclusionText}>{translatedMyth.conclusion}</Text>
      </View>

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
  mythTagContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  mythTag: {
    backgroundColor: '#fce4ec',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mythTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e91e63',
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
  mythStatement: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: '600',
    lineHeight: 24,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  factText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  factItem: {
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
  factItemText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  conclusionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});


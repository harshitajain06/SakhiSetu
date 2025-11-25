import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';
import ContentIllustration from './components/ContentIllustration';

export default function PregnancyBasicsDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  const { t } = useTranslation();

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>{t('general.contentNotFound')}</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>{t('pregnancyBasics.week')} {item.week}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Week Badge */}
      <View style={styles.weekBadgeContainer}>
        <View style={styles.weekBadge}>
          <Text style={styles.weekBadgeText}>{t('pregnancyBasics.week')} {item.week}</Text>
          <Text style={styles.trimesterBadge}>{item.trimester} {t('pregnancyBasics.trimester')}</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <ContentIllustration imageType={item.imageType} category="pregnancy" />
      </View>

      {/* Overview Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={24} color="#e91e63" />
          <Text style={styles.sectionTitle}>{t('pregnancyBasics.overview')}</Text>
        </View>
        <Text style={styles.contentText}>{item.overview}</Text>
      </View>

      {/* Baby Development Section */}
      {item.babyDevelopment && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={24} color="#e91e63" />
            <Text style={styles.sectionTitle}>{t('pregnancyBasics.babyDevelopment')}</Text>
          </View>
          <Text style={styles.contentText}>{item.babyDevelopment}</Text>
        </View>
      )}

      {/* Your Body Section */}
      {item.yourBody && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="body" size={24} color="#e91e63" />
            <Text style={styles.sectionTitle}>{t('pregnancyBasics.yourBody')}</Text>
          </View>
          <Text style={styles.contentText}>{item.yourBody}</Text>
        </View>
      )}

      {/* Symptoms Section */}
      {item.symptoms && item.symptoms.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color="#e91e63" />
            <Text style={styles.sectionTitle}>{t('pregnancyBasics.commonSymptoms')}</Text>
          </View>
          {item.symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tips Section */}
      {item.tips && item.tips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#e91e63" />
            <Text style={styles.sectionTitle}>{t('pregnancyBasics.tipsForThisWeek')}</Text>
          </View>
          {item.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Important Note Section */}
      {item.importantNote && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={24} color="#e91e63" />
            <Text style={styles.sectionTitle}>{t('pregnancyBasics.importantNote')}</Text>
          </View>
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item.importantNote}</Text>
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
  weekBadgeContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  weekBadge: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  weekBadgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  trimesterBadge: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
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
    textAlign: 'center',
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginVertical: 16,
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
  symptomItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e91e63',
    marginTop: 8,
    marginRight: 12,
  },
  symptomText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  noteContainer: {
    backgroundColor: '#FCE4EC',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e91e63',
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


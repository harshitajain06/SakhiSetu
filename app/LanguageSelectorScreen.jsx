import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation, languages } from '../contexts/TranslationContext';

export default function LanguageSelectorScreen() {
  const navigation = useNavigation();
  const { language, changeLanguage, t } = useTranslation();

  const handleLanguageSelect = async (langCode) => {
    await changeLanguage(langCode);
    // Optionally navigate back
    navigation.goBack();
  };

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
        <Text style={styles.headerTitle}>{t('nav.language')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Language List */}
      <View style={styles.languageList}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageItem,
              language === lang.code && styles.languageItemActive,
            ]}
            onPress={() => handleLanguageSelect(lang.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{lang.nativeName}</Text>
              <Text style={styles.languageCode}>{lang.name}</Text>
            </View>
            {language === lang.code && (
              <Ionicons name="checkmark-circle" size={24} color="#e91e63" />
            )}
          </TouchableOpacity>
        ))}
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
  languageList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageItemActive: {
    backgroundColor: '#FCE4EC',
    borderColor: '#e91e63',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  languageCode: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacer: {
    height: 40,
  },
});


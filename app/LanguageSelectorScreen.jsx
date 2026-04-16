import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation, languages } from '../contexts/TranslationContext';

const isWeb = Platform.OS === 'web';

export default function LanguageSelectorScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { language, changeLanguage, t } = useTranslation();

  const handleLanguageSelect = async (langCode) => {
    await changeLanguage(langCode);
    navigation.goBack();
  };

  const bottomPad = isWeb ? 24 : Math.max(insets.bottom, 16) + 12;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t('nav.language')}
          </Text>
        </View>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={isWeb}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Image
            source={require('../assets/images/SakhiSetu_logo.png')}
            style={styles.heroLogo}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={styles.languageList}>
          {languages.map((lang) => {
            const selected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.languageItem, selected && styles.languageItemActive]}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{lang.nativeName}</Text>
                  <Text style={styles.languageCode}>{lang.name}</Text>
                </View>
                {selected ? (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.checkPlaceholder} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8eaed',
    backgroundColor: '#fff',
  },
  headerSide: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: isWeb ? 18 : 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: isWeb ? 12 : 16,
  },
  heroLogo: {
    width: isWeb ? 40 : 44,
    height: isWeb ? 40 : 44,
    opacity: 0.92,
  },
  languageList: {
    paddingHorizontal: isWeb ? 16 : 20,
    paddingTop: 4,
    gap: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: isWeb ? 14 : 16,
    paddingHorizontal: isWeb ? 16 : 18,
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e4e6eb',
  },
  languageItemActive: {
    backgroundColor: '#fce4ec',
    borderColor: '#e91e63',
    borderWidth: 1.5,
  },
  languageInfo: {
    flex: 1,
    marginRight: 12,
  },
  languageName: {
    fontSize: isWeb ? 17 : 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  languageCode: {
    fontSize: isWeb ? 13 : 14,
    color: '#5f6368',
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkPlaceholder: {
    width: 32,
    height: 32,
  },
});

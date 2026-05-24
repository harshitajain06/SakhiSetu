import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation, languages } from '../contexts/TranslationContext';
import ProfileScreen from './ProfileScreen';

export default function HealthSelectionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, language } = useTranslation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const isWeb = Platform.OS === 'web';
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const tips = [
    t('healthSelection.tip1'),
    t('healthSelection.tip2'),
    t('healthSelection.tip3'),
    t('healthSelection.tip4'),
    t('healthSelection.tip5'),
    t('healthSelection.tip6'),
    t('healthSelection.tip7'),
    t('healthSelection.tip8'),
  ];

  const handleMenstrualHealth = () => {
    navigation.replace('MenstrualHealthTabs');
  };

  const handleMaternalWellness = () => {
    // Navigate to pregnancy tracker in maternal health
    navigation.replace('MaternalHealthTabs', {
      targetTab: 'insights',
      insightsTab: 'pregnancy',
    });
  };

  const handleChildVaccination = () => {
    navigation.replace('MaternalHealthTabs', {
      targetTab: 'insights',
      insightsTab: 'vaccination',
    });
  };

  const handleSakhiSetuForum = () => {
    navigation.replace('MaternalHealthTabs', {
      targetTab: 'community',
      communityTab: 'forum',
    });
  };

  const nextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
  };

  const scrollBottomPad = isWeb ? 28 : Math.max(insets.bottom, 16) + 12;

  return (
    <SafeAreaView
      style={[styles.container, isWeb && styles.containerWeb]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={[styles.scrollView, isWeb && styles.scrollViewWeb]}
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && styles.scrollContentWeb,
          { paddingBottom: scrollBottomPad },
        ]}
        showsVerticalScrollIndicator={isWeb}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* Header */}
        <View style={[styles.header, isWeb && styles.headerWeb]}>
          <Text style={styles.appTitle}>{t('healthSelection.appTitle')}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => setProfileModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <View style={styles.profileImage}>
                <Ionicons name="person-circle-outline" size={isWeb ? 20 : 22} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Selector */}
        <TouchableOpacity
          style={[styles.languageSelector, isWeb && styles.languageSelectorWeb]}
          onPress={() => navigation.navigate('LanguageSelector')}
          activeOpacity={0.7}
        >
          <View style={styles.languageSelectorLeft}>
            <Ionicons name="globe-outline" size={isWeb ? 18 : 20} color="#5c6bc0" />
            <Text style={styles.languageText}>{currentLanguage.nativeName}</Text>
          </View>
          <Ionicons name="chevron-down" size={isWeb ? 18 : 20} color="#757575" />
        </TouchableOpacity>

        {/* Main Content Cards */}
        <View style={[styles.cardsContainer, isWeb && styles.cardsContainerWeb]}>
          {/* Menstrual Health Card */}
          <TouchableOpacity
            style={[styles.card, styles.menstrualHealthCard, isWeb && styles.cardWeb]}
            onPress={handleMenstrualHealth}
            activeOpacity={0.92}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.cardIconBadge, styles.cardIconBadgePink]}>
                <Ionicons name="water-outline" size={isWeb ? 22 : 28} color="#c2185b" />
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>{t('healthSelection.menstrualHealth')}</Text>
                <Text style={[styles.cardDescription, isWeb && styles.cardDescriptionWeb]} numberOfLines={isWeb ? 2 : 3}>
                  {t('healthSelection.menstrualHealthDesc')}
                </Text>
              </View>
            </View>
            <View style={styles.cardCta}>
              <Text style={styles.cardCtaText}>{t('healthSelection.exploreCycleTracking')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#c2185b" />
            </View>
          </TouchableOpacity>

          {/* Maternal Wellness Card */}
          <TouchableOpacity
            style={[styles.card, styles.maternalWellnessCard, isWeb && styles.cardWeb]}
            onPress={handleMaternalWellness}
            activeOpacity={0.92}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.cardIconBadge, styles.cardIconBadgeBlue]}>
                <Ionicons name="heart-outline" size={isWeb ? 22 : 28} color="#1565c0" />
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>{t('healthSelection.maternalWellness')}</Text>
                <Text style={[styles.cardDescription, isWeb && styles.cardDescriptionWeb]} numberOfLines={isWeb ? 2 : 3}>
                  {t('healthSelection.maternalWellnessDesc')}
                </Text>
              </View>
            </View>
            <View style={styles.cardCta}>
              <Text style={styles.cardCtaTextBlue}>{t('healthSelection.exploreMaternalWellness')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#1565c0" />
            </View>
          </TouchableOpacity>

          {/* Child Vaccination Card */}
          <TouchableOpacity
            style={[styles.card, styles.childVaccinationCard, isWeb && styles.cardWeb]}
            onPress={handleChildVaccination}
            activeOpacity={0.92}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.cardIconBadge, styles.cardIconBadgeGreen]}>
                <Ionicons name="shield-checkmark-outline" size={isWeb ? 22 : 28} color="#2e7d32" />
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>{t('healthSelection.childVaccination')}</Text>
                <Text style={[styles.cardDescription, isWeb && styles.cardDescriptionWeb]} numberOfLines={isWeb ? 2 : 3}>
                  {t('healthSelection.childVaccinationDesc')}
                </Text>
              </View>
            </View>
            <View style={styles.cardCta}>
              <Text style={styles.cardCtaTextGreen}>{t('healthSelection.exploreChildVaccination')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#2e7d32" />
            </View>
          </TouchableOpacity>

          {/* SakhiSetu Forum Card */}
          <TouchableOpacity
            style={[styles.card, styles.sakhiSetuForumCard, isWeb && styles.cardWeb]}
            onPress={handleSakhiSetuForum}
            activeOpacity={0.92}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.cardIconBadge, styles.cardIconBadgeOrange]}>
                <Ionicons name="chatbubbles-outline" size={isWeb ? 22 : 28} color="#ef6c00" />
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>{t('healthSelection.sakhiSetuForum')}</Text>
                <Text style={[styles.cardDescription, isWeb && styles.cardDescriptionWeb]} numberOfLines={isWeb ? 2 : 3}>
                  {t('healthSelection.sakhiSetuForumDesc')}
                </Text>
              </View>
            </View>
            <View style={styles.cardCta}>
              <Text style={styles.cardCtaTextOrange}>{t('healthSelection.exploreSakhiSetuForum')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#ef6c00" />
            </View>
          </TouchableOpacity>

          {/* Today's Tip Section */}
          <View style={[styles.tipsSection, isWeb && styles.tipsSectionWeb]}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={isWeb ? 18 : 24} color="#333" />
              <Text style={[styles.tipsTitle, isWeb && styles.tipsTitleWeb]}>{t('healthSelection.dailyTips')}</Text>
            </View>
            <Text style={[styles.tipText, isWeb && styles.tipTextWeb]} numberOfLines={isWeb ? 2 : undefined}>
              {tips[currentTipIndex]}
            </Text>
            <View style={styles.tipsNavigation}>
              <TouchableOpacity style={styles.tipNavButton} onPress={prevTip}>
                <Ionicons name="chevron-back" size={isWeb ? 18 : 20} color="#666" />
              </TouchableOpacity>
              <View style={styles.tipDots}>
                {tips.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tipDot,
                      index === currentTipIndex && styles.activeTipDot
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.tipNavButton} onPress={nextTip}>
                <Ionicons name="chevron-forward" size={isWeb ? 18 : 20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <ProfileScreen
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerWeb: {
    width: '100%',
    maxHeight: '100vh',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewWeb: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentWeb: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingTop: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isWeb ? 12 : 20,
    paddingTop: isWeb ? 4 : 6,
    paddingBottom: isWeb ? 6 : 14,
  },
  headerWeb: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  appTitle: {
    fontSize: isWeb ? 18 : 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileIcon: {
    padding: 5,
  },
  profileImage: {
    width: isWeb ? 28 : 32,
    height: isWeb ? 28 : 32,
    borderRadius: isWeb ? 14 : 16,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    marginHorizontal: isWeb ? 12 : 20,
    marginBottom: isWeb ? 8 : 16,
    paddingHorizontal: isWeb ? 12 : 16,
    paddingVertical: isWeb ? 8 : 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e1e4e8',
    justifyContent: 'space-between',
  },
  languageSelectorWeb: {
    marginBottom: 6,
    paddingVertical: 6,
  },
  languageSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  languageText: {
    fontSize: isWeb ? 13 : 16,
    color: '#333',
    fontWeight: '500',
  },
  cardsContainer: {
    paddingHorizontal: isWeb ? 12 : 20,
    gap: isWeb ? 8 : 14,
  },
  cardsContainerWeb: {
    gap: 6,
  },
  card: {
    borderRadius: isWeb ? 12 : 18,
    padding: isWeb ? 10 : 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardWeb: {
    padding: 10,
    borderRadius: 12,
  },
  menstrualHealthCard: {
    backgroundColor: '#d81b60',
  },
  maternalWellnessCard: {
    backgroundColor: '#1976d2',
  },
  childVaccinationCard: {
    backgroundColor: '#388e3c',
  },
  sakhiSetuForumCard: {
    backgroundColor: '#f57c00',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: isWeb ? 8 : 14,
  },
  cardIconBadge: {
    width: isWeb ? 40 : 52,
    height: isWeb ? 40 : 52,
    borderRadius: isWeb ? 12 : 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconBadgePink: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cardIconBadgeBlue: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cardIconBadgeGreen: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cardIconBadgeOrange: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cardTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  cardTitle: {
    fontSize: isWeb ? 15 : 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
    marginBottom: isWeb ? 3 : 6,
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: isWeb ? 12 : 14,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'left',
    lineHeight: isWeb ? 16 : 20,
  },
  cardDescriptionWeb: {
    fontSize: 11,
    lineHeight: 15,
  },
  cardCta: {
    marginTop: isWeb ? 8 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: isWeb ? 7 : 12,
    paddingHorizontal: isWeb ? 10 : 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardCtaText: {
    fontSize: isWeb ? 12 : 15,
    fontWeight: '600',
    color: '#c2185b',
    flex: 1,
  },
  cardCtaTextBlue: {
    fontSize: isWeb ? 12 : 15,
    fontWeight: '600',
    color: '#1565c0',
    flex: 1,
  },
  cardCtaTextGreen: {
    fontSize: isWeb ? 12 : 15,
    fontWeight: '600',
    color: '#2e7d32',
    flex: 1,
  },
  cardCtaTextOrange: {
    fontSize: isWeb ? 12 : 15,
    fontWeight: '600',
    color: '#ef6c00',
    flex: 1,
  },
  tipsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: isWeb ? 10 : 16,
    padding: isWeb ? 10 : 20,
    marginTop: isWeb ? 2 : 10,
  },
  tipsSectionWeb: {
    padding: 8,
    marginTop: 0,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isWeb ? 4 : 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: isWeb ? 14 : 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tipsTitleWeb: {
    fontSize: 13,
  },
  tipText: {
    fontSize: isWeb ? 12 : 16,
    color: '#333',
    lineHeight: isWeb ? 16 : 22,
    marginBottom: isWeb ? 6 : 16,
  },
  tipTextWeb: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 4,
  },
  tipsNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipNavButton: {
    padding: isWeb ? 4 : 8,
  },
  tipDots: {
    flexDirection: 'row',
    gap: isWeb ? 4 : 6,
  },
  tipDot: {
    width: isWeb ? 6 : 8,
    height: isWeb ? 6 : 8,
    borderRadius: isWeb ? 3 : 4,
    backgroundColor: '#ccc',
  },
  activeTipDot: {
    backgroundColor: '#e91e63',
  },
});

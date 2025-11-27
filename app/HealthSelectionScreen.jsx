import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation, languages } from '../contexts/TranslationContext';
import ProfileScreen from './ProfileScreen';

export default function HealthSelectionScreen() {
  const navigation = useNavigation();
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

  const handleMaternalHealth = () => {
    navigation.replace('MaternalHealthTabs');
  };

  const handleMenstrualHealth = () => {
    navigation.replace('MenstrualHealthTabs');
  };

  const handleMaternalWellness = () => {
    // Navigate to pregnancy tracker in maternal health
    navigation.replace('MaternalHealthTabs', { screen: 'Pregnancy' });
  };

  const nextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>{t('healthSelection.appTitle')}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => setProfileModalVisible(true)}
            >
              <View style={styles.profileImage}>
                <Ionicons name="person" size={isWeb ? 18 : 20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Selector */}
        <TouchableOpacity 
          style={styles.languageSelector}
          onPress={() => navigation.navigate('LanguageSelector')}
          activeOpacity={0.7}
        >
          <Ionicons name="globe-outline" size={isWeb ? 18 : 20} color="#666" />
          <Text style={styles.languageText}>{currentLanguage.nativeName}</Text>
          <Ionicons name="chevron-forward" size={isWeb ? 14 : 16} color="#666" />
        </TouchableOpacity>

        {/* Main Content Cards */}
        <View style={styles.cardsContainer}>
          {/* Menstrual Health Card */}
          <TouchableOpacity style={[styles.card, styles.menstrualHealthCard]} onPress={handleMenstrualHealth}>
            <View style={styles.cardIconContainer}>
              <View style={styles.cardIconCircle}>
                <Ionicons name="heart-outline" size={isWeb ? 24 : 30} color="#fff" />
              </View>
            </View>
            <Text style={styles.cardTitle}>{t('healthSelection.menstrualHealth')}</Text>
            <Text style={styles.cardDescription}>
              {t('healthSelection.menstrualHealthDesc')}
            </Text>
            <TouchableOpacity style={styles.cardButton} onPress={handleMenstrualHealth}>
              <Text style={styles.cardButtonText}>{t('healthSelection.exploreCycleTracking')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Maternal Wellness Card */}
          <TouchableOpacity style={[styles.card, styles.maternalWellnessCard]} onPress={handleMaternalWellness}>
            <View style={styles.cardIconContainer}>
              <View style={styles.cardIconCircle}>
                <Ionicons name="medical-outline" size={isWeb ? 24 : 30} color="#fff" />
              </View>
            </View>
            <Text style={styles.cardTitle}>{t('healthSelection.maternalWellness')}</Text>
            <Text style={styles.cardDescription}>
              {t('healthSelection.maternalWellnessDesc')}
            </Text>
            <TouchableOpacity style={styles.cardButton} onPress={handleMaternalWellness}>
              <Text style={styles.cardButtonText}>{t('healthSelection.exploreMaternalWellness')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Today's Tip Section */}
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={isWeb ? 20 : 24} color="#333" />
              <Text style={styles.tipsTitle}>{t('healthSelection.dailyTips')}</Text>
            </View>
            <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: isWeb ? 10 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isWeb ? 16 : 20,
    paddingTop: isWeb ? 8 : 10,
    paddingBottom: isWeb ? 12 : 20,
  },
  appTitle: {
    fontSize: isWeb ? 20 : 24,
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
    backgroundColor: '#fff',
    marginHorizontal: isWeb ? 16 : 20,
    marginBottom: isWeb ? 12 : 20,
    paddingHorizontal: isWeb ? 12 : 15,
    paddingVertical: isWeb ? 8 : 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
    justifyContent: 'space-between',
  },
  languageText: {
    fontSize: isWeb ? 14 : 16,
    color: '#333',
    fontWeight: '500',
  },
  cardsContainer: {
    paddingHorizontal: isWeb ? 16 : 20,
    gap: isWeb ? 12 : 20,
    paddingBottom: isWeb ? 12 : 20,
  },
  card: {
    borderRadius: isWeb ? 12 : 16,
    padding: isWeb ? 16 : 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menstrualHealthCard: {
    backgroundColor: '#e91e63',
  },
  maternalWellnessCard: {
    backgroundColor: '#2196f3',
  },
  cardIconContainer: {
    alignItems: 'center',
    marginBottom: isWeb ? 10 : 16,
  },
  cardIconCircle: {
    width: isWeb ? 48 : 60,
    height: isWeb ? 48 : 60,
    borderRadius: isWeb ? 24 : 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: isWeb ? 20 : 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: isWeb ? 8 : 12,
  },
  cardDescription: {
    fontSize: isWeb ? 14 : 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: isWeb ? 20 : 22,
    marginBottom: isWeb ? 12 : 20,
    opacity: 0.95,
  },
  cardButton: {
    backgroundColor: '#fff',
    paddingVertical: isWeb ? 8 : 12,
    paddingHorizontal: isWeb ? 16 : 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  cardButtonText: {
    fontSize: isWeb ? 14 : 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  tipsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: isWeb ? 12 : 16,
    padding: isWeb ? 14 : 20,
    marginTop: isWeb ? 4 : 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isWeb ? 8 : 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: isWeb ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tipText: {
    fontSize: isWeb ? 14 : 16,
    color: '#333',
    lineHeight: isWeb ? 20 : 22,
    marginBottom: isWeb ? 10 : 16,
  },
  tipsNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipNavButton: {
    padding: 8,
  },
  tipDots: {
    flexDirection: 'row',
    gap: 6,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeTipDot: {
    backgroundColor: '#e91e63',
  },
});

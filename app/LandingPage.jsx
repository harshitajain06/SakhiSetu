import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect } from 'react';
import { Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';
import { auth } from '../config/firebase';
import { reload } from 'firebase/auth';

export default function LandingPage() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [user, loading] = useAuthState(auth);
  const isWeb = Platform.OS === 'web';

  // Redirect authenticated users to the app
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (user && !loading) {
        try {
          await reload(user);
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.emailVerified) {
            navigation.replace('WelcomeScreen');
          } else {
            // If not verified, go to login page
            navigation.replace('LoginRegister');
          }
        } catch (error) {
          console.error('Error checking user:', error);
          // On error, still redirect to login
          if (user) {
            navigation.replace('LoginRegister');
          }
        }
      }
    };

    checkUserAndRedirect();
  }, [user, loading, navigation]);

  const handleGetStarted = () => {
    navigation.replace('LoginRegister');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      {isWeb && (
        <style>{`
          .landing-scroll-container > div {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
          .landing-scroll-container > div::-webkit-scrollbar {
            width: 8px;
          }
          .landing-scroll-container > div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .landing-scroll-container > div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .landing-scroll-container > div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        className={isWeb ? 'landing-scroll-container' : undefined}
        showsVerticalScrollIndicator={!isWeb}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, isWeb && styles.heroSectionWeb]}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/SakhiSetu_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appTitle, isWeb && styles.appTitleWeb]}>SakhiSetu</Text>
          <Text style={[styles.tagline, isWeb && styles.taglineWeb]}>
            Your Maternal Health Companion
          </Text>
          <Text style={[styles.description, isWeb && styles.descriptionWeb]}>
            Comprehensive support for pregnancy, postpartum, and newborn care. 
            Track your cycle, understand symptoms, and access wellness resources for every stage.
          </Text>
        </View>

        {/* Features Section */}
        <View style={[styles.featuresSection, isWeb && styles.featuresSectionWeb]}>
          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>Key Features</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="heart" size={isWeb ? 24 : 28} color="#e91e63" />
            </View>
            <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Maternal Wellness</Text>
            <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
              Comprehensive support for pregnancy, postpartum, and newborn care with personalized insights.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="calendar" size={isWeb ? 24 : 28} color="#2196f3" />
            </View>
            <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Cycle Tracking</Text>
            <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
              Track your menstrual cycle, understand symptoms, and access wellness resources.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={isWeb ? 24 : 28} color="#4caf50" />
            </View>
            <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Community Support</Text>
            <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
              Find health centers, counselors, and emergency resources nearby.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="book" size={isWeb ? 24 : 28} color="#ff9800" />
            </View>
            <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Educational Content</Text>
            <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
              Access curated videos, articles, and guides on maternal and menstrual health.
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={[styles.ctaSection, isWeb && styles.ctaSectionWeb]}>
          <TouchableOpacity
            style={[styles.getStartedButton, isWeb && styles.getStartedButtonWeb]}
            onPress={handleGetStarted}
          >
            <Text style={[styles.getStartedButtonText, isWeb && styles.getStartedButtonTextWeb]}>
              Get Started
            </Text>
            <Ionicons name="arrow-forward" size={isWeb ? 18 : 20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, isWeb && styles.footerWeb]}>
          <TouchableOpacity
            onPress={handlePrivacyPolicy}
            style={styles.privacyLink}
          >
            <Text style={[styles.privacyLinkText, isWeb && styles.privacyLinkTextWeb]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <Text style={[styles.copyright, isWeb && styles.copyrightWeb]}>
            © 2024 SakhiSetu. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
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
    minHeight: '100vh',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: isWeb ? 20 : 30,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: isWeb ? 40 : 60,
    paddingBottom: isWeb ? 30 : 40,
    paddingHorizontal: isWeb ? 20 : 24,
  },
  heroSectionWeb: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: isWeb ? 20 : 24,
  },
  logo: {
    width: isWeb ? 120 : 150,
    height: isWeb ? 120 : 150,
  },
  appTitle: {
    fontSize: isWeb ? 36 : 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 8 : 12,
    textAlign: 'center',
  },
  appTitleWeb: {
    fontSize: 40,
  },
  tagline: {
    fontSize: isWeb ? 18 : 20,
    color: '#666',
    marginBottom: isWeb ? 16 : 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  taglineWeb: {
    fontSize: 20,
  },
  description: {
    fontSize: isWeb ? 15 : 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: isWeb ? 22 : 24,
    maxWidth: 600,
  },
  descriptionWeb: {
    fontSize: 16,
  },
  featuresSection: {
    paddingHorizontal: isWeb ? 20 : 24,
    paddingVertical: isWeb ? 30 : 40,
  },
  featuresSectionWeb: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: isWeb ? 28 : 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 24 : 30,
    textAlign: 'center',
  },
  sectionTitleWeb: {
    fontSize: 30,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: isWeb ? 12 : 16,
    padding: isWeb ? 20 : 24,
    marginBottom: isWeb ? 16 : 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: isWeb ? 50 : 60,
    height: isWeb ? 50 : 60,
    borderRadius: isWeb ? 25 : 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isWeb ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: isWeb ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 6 : 8,
    flex: 1,
  },
  featureTitleWeb: {
    fontSize: 19,
  },
  featureDescription: {
    fontSize: isWeb ? 14 : 15,
    color: '#666',
    lineHeight: isWeb ? 20 : 22,
    flex: 1,
  },
  featureDescriptionWeb: {
    fontSize: 15,
  },
  ctaSection: {
    paddingHorizontal: isWeb ? 20 : 24,
    paddingVertical: isWeb ? 30 : 40,
    alignItems: 'center',
  },
  ctaSectionWeb: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: '#e91e63',
    paddingVertical: isWeb ? 14 : 16,
    paddingHorizontal: isWeb ? 32 : 40,
    borderRadius: isWeb ? 12 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedButtonWeb: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: isWeb ? 18 : 20,
    fontWeight: 'bold',
  },
  getStartedButtonTextWeb: {
    fontSize: 19,
  },
  footer: {
    paddingHorizontal: isWeb ? 20 : 24,
    paddingVertical: isWeb ? 30 : 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: isWeb ? 20 : 30,
  },
  footerWeb: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  privacyLink: {
    marginBottom: isWeb ? 12 : 16,
  },
  privacyLinkText: {
    color: '#2196f3',
    fontSize: isWeb ? 15 : 16,
    textDecorationLine: 'underline',
  },
  privacyLinkTextWeb: {
    fontSize: 16,
    cursor: 'pointer',
  },
  copyright: {
    fontSize: isWeb ? 13 : 14,
    color: '#999',
    textAlign: 'center',
  },
  copyrightWeb: {
    fontSize: 14,
  },
});

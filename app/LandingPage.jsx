import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { reload } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase';
import { useTranslation } from '../contexts/TranslationContext';

export default function LandingPage() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [user, loading] = useAuthState(auth);
  const isWeb = Platform.OS === 'web';
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    if (isWeb) {
      const updateDimensions = () => {
        setWindowWidth(Dimensions.get('window').width);
      };
      const subscription = Dimensions.addEventListener('change', updateDimensions);
      return () => subscription?.remove();
    }
  }, [isWeb]);

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

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const [buttonHover, setButtonHover] = useState(false);
  const [privacyHover, setPrivacyHover] = useState(false);
  const [termsHover, setTermsHover] = useState(false);
  const [featureHovers, setFeatureHovers] = useState({});

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      {isWeb && (
        <style>{`
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          #root {
            height: 100%;
            width: 100%;
          }
          @media (max-width: 768px) {
            .feature-grid {
              flex-direction: column !important;
            }
          }
          @media (min-width: 1024px) {
            .feature-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
          }
        `}</style>
      )}
      <View
        style={[
          styles.contentContainer,
          isWeb && styles.contentContainerWeb
        ]}
        className={isWeb && isDesktop ? 'feature-grid' : undefined}
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
          
          <View 
            style={[
              styles.featuresGrid,
              isDesktop && styles.featuresGridDesktop,
              isTablet && styles.featuresGridTablet
            ]}
            className={isWeb && isDesktop ? 'feature-grid' : undefined}
          >
            <View 
              style={[
                styles.featureCard, 
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[0] && styles.featureCardHover
              ]}
              onMouseEnter={() => isWeb && setFeatureHovers({...featureHovers, 0: true})}
              onMouseLeave={() => isWeb && setFeatureHovers({...featureHovers, 0: false})}
            >
              <View style={styles.featureIcon}>
                <Ionicons name="heart" size={isWeb ? 20 : 28} color="#e91e63" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Maternal Wellness</Text>
                <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
                  Comprehensive support for pregnancy, postpartum, and newborn care with personalized insights.
                </Text>
              </View>
            </View>

            <View 
              style={[
                styles.featureCard, 
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[1] && styles.featureCardHover
              ]}
              onMouseEnter={() => isWeb && setFeatureHovers({...featureHovers, 1: true})}
              onMouseLeave={() => isWeb && setFeatureHovers({...featureHovers, 1: false})}
            >
              <View style={styles.featureIcon}>
                <Ionicons name="calendar" size={isWeb ? 20 : 28} color="#2196f3" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Cycle Tracking</Text>
                <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
                  Track your menstrual cycle, understand symptoms, and access wellness resources.
                </Text>
              </View>
            </View>

            <View 
              style={[
                styles.featureCard, 
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[2] && styles.featureCardHover
              ]}
              onMouseEnter={() => isWeb && setFeatureHovers({...featureHovers, 2: true})}
              onMouseLeave={() => isWeb && setFeatureHovers({...featureHovers, 2: false})}
            >
              <View style={styles.featureIcon}>
                <Ionicons name="people" size={isWeb ? 20 : 28} color="#4caf50" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Community Support</Text>
                <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
                  Find health centers, counselors, and emergency resources nearby.
                </Text>
              </View>
            </View>

            <View 
              style={[
                styles.featureCard, 
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[3] && styles.featureCardHover
              ]}
              onMouseEnter={() => isWeb && setFeatureHovers({...featureHovers, 3: true})}
              onMouseLeave={() => isWeb && setFeatureHovers({...featureHovers, 3: false})}
            >
              <View style={styles.featureIcon}>
                <Ionicons name="book" size={isWeb ? 20 : 28} color="#ff9800" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}>Educational Content</Text>
                <Text style={[styles.featureDescription, isWeb && styles.featureDescriptionWeb]}>
                  Access curated videos, articles, and guides on maternal and menstrual health.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={[styles.ctaSection, isWeb && styles.ctaSectionWeb]}>
          <TouchableOpacity
            style={[
              styles.getStartedButton, 
              isWeb && styles.getStartedButtonWeb,
              isWeb && buttonHover && styles.getStartedButtonHover
            ]}
            onPress={handleGetStarted}
            onMouseEnter={() => isWeb && setButtonHover(true)}
            onMouseLeave={() => isWeb && setButtonHover(false)}
          >
            <Text style={[styles.getStartedButtonText, isWeb && styles.getStartedButtonTextWeb]}>
              Get Started
            </Text>
            <Ionicons name="arrow-forward" size={isWeb ? 16 : 20} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, isWeb && styles.footerWeb]}>
          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={handlePrivacyPolicy}
              style={styles.footerLink}
              onMouseEnter={() => isWeb && setPrivacyHover(true)}
              onMouseLeave={() => isWeb && setPrivacyHover(false)}
            >
              <Text style={[
                styles.footerLinkText, 
                isWeb && styles.footerLinkTextWeb,
                isWeb && privacyHover && styles.footerLinkTextHover
              ]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text style={[styles.footerLinkSeparator, isWeb && styles.footerLinkSeparatorWeb]}>•</Text>
            <TouchableOpacity
              onPress={handleTermsOfService}
              style={styles.footerLink}
              onMouseEnter={() => isWeb && setTermsHover(true)}
              onMouseLeave={() => isWeb && setTermsHover(false)}
            >
              <Text style={[
                styles.footerLinkText, 
                isWeb && styles.footerLinkTextWeb,
                isWeb && termsHover && styles.footerLinkTextHover
              ]}>
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.copyright, isWeb && styles.copyrightWeb]}>
            © 2024 SakhiSetu. All rights reserved.
          </Text>
        </View>
      </View>
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
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: isWeb ? 10 : 30,
  },
  contentContainerWeb: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: isWeb ? 16 : 30,
    overflow: 'hidden',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: isWeb ? 20 : 60,
    paddingBottom: isWeb ? 12 : 40,
    paddingHorizontal: isWeb ? 20 : 24,
  },
  heroSectionWeb: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 12,
  },
  logoContainer: {
    marginBottom: isWeb ? 8 : 24,
  },
  logo: {
    width: isWeb ? 80 : 150,
    height: isWeb ? 80 : 150,
  },
  appTitle: {
    fontSize: isWeb ? 28 : 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 4 : 12,
    textAlign: 'center',
  },
  appTitleWeb: {
    fontSize: 28,
  },
  tagline: {
    fontSize: isWeb ? 14 : 20,
    color: '#666',
    marginBottom: isWeb ? 6 : 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  taglineWeb: {
    fontSize: 14,
  },
  description: {
    fontSize: isWeb ? 12 : 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: isWeb ? 16 : 24,
    maxWidth: 600,
  },
  descriptionWeb: {
    fontSize: 12,
    lineHeight: 16,
  },
  featuresSection: {
    paddingHorizontal: isWeb ? 20 : 24,
    paddingVertical: isWeb ? 12 : 40,
  },
  featuresSectionWeb: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: 8,
    flex: 1,
    minHeight: 0,
  },
  featuresGrid: {
    width: '100%',
  },
  featuresGridDesktop: {
    // Grid layout handled by CSS
  },
  featuresGridTablet: {
    // Can add tablet-specific styles if needed
  },
  sectionTitle: {
    fontSize: isWeb ? 18 : 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 10 : 30,
    textAlign: 'center',
  },
  sectionTitleWeb: {
    fontSize: 18,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: isWeb ? 8 : 16,
    padding: isWeb ? 12 : 24,
    marginBottom: isWeb ? 8 : 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureCardWeb: {
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  featureCardHover: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  featureContent: {
    flex: 1,
    flexShrink: 1,
  },
  featureIcon: {
    width: isWeb ? 36 : 60,
    height: isWeb ? 36 : 60,
    borderRadius: isWeb ? 18 : 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isWeb ? 10 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: isWeb ? 14 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 4 : 8,
    flex: 1,
  },
  featureTitleWeb: {
    fontSize: 14,
  },
  featureDescription: {
    fontSize: isWeb ? 11 : 15,
    color: '#666',
    lineHeight: isWeb ? 14 : 22,
    flex: 1,
  },
  featureDescriptionWeb: {
    fontSize: 11,
    lineHeight: 14,
  },
  ctaSection: {
    paddingHorizontal: isWeb ? 20 : 24,
    paddingVertical: isWeb ? 12 : 40,
    alignItems: 'center',
  },
  ctaSectionWeb: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  getStartedButton: {
    backgroundColor: '#e91e63',
    paddingVertical: isWeb ? 10 : 16,
    paddingHorizontal: isWeb ? 24 : 40,
    borderRadius: isWeb ? 8 : 16,
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
    userSelect: 'none',
  },
  getStartedButtonHover: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: isWeb ? 14 : 20,
    fontWeight: 'bold',
  },
  getStartedButtonTextWeb: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: isWeb ? 20 : 24,
    paddingVertical: isWeb ? 8 : 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: isWeb ? 8 : 30,
  },
  footerWeb: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isWeb ? 4 : 16,
    flexWrap: 'wrap',
  },
  footerLink: {
    paddingHorizontal: isWeb ? 8 : 4,
  },
  footerLinkText: {
    color: '#2196f3',
    fontSize: isWeb ? 11 : 16,
    textDecorationLine: 'underline',
  },
  footerLinkTextWeb: {
    fontSize: 11,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    userSelect: 'none',
  },
  footerLinkTextHover: {
    color: '#1976d2',
  },
  footerLinkSeparator: {
    color: '#999',
    fontSize: isWeb ? 11 : 13,
    marginHorizontal: isWeb ? 6 : 6,
  },
  footerLinkSeparatorWeb: {
    fontSize: 11,
  },
  copyright: {
    fontSize: isWeb ? 10 : 14,
    color: '#999',
    textAlign: 'center',
  },
  copyrightWeb: {
    fontSize: 10,
  },
});

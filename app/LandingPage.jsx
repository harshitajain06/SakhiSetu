import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import WebLink from "../components/WebLink";
import WebStyle from "../components/WebStyle";
import { useTranslation } from "../contexts/TranslationContext";

export default function LandingPage() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const isWeb = Platform.OS === "web";
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    if (isWeb) {
      const updateDimensions = () => {
        setWindowWidth(Dimensions.get("window").width);
      };
      const subscription = Dimensions.addEventListener(
        "change",
        updateDimensions,
      );
      return () => subscription?.remove();
    }
  }, [isWeb]);

  const handleGetStarted = () => {
    navigation.replace("LoginRegister");
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleTermsOfService = () => {
    navigation.navigate("TermsOfService");
  };

  const [buttonHover, setButtonHover] = useState(false);
  const [privacyHover, setPrivacyHover] = useState(false);
  const [termsHover, setTermsHover] = useState(false);
  const [featureHovers, setFeatureHovers] = useState({});

  const landingWebCss = isWeb
    ? `
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          #root { min-height: 100%; width: 100%; }
          [href*="PrivacyPolicy"], [href*="TermsOfService"] {
            color: #2196f3 !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
          @media (min-width: 768px) {
            .feature-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
            }
          }
        `
    : '';

  return (
    <>
      <WebStyle css={landingWebCss} />
      <View style={[styles.container, isWeb && styles.containerWeb]}>
      <ScrollView
        style={[styles.scrollView, isWeb && styles.scrollViewWeb]}
        contentContainerStyle={[
          styles.contentContainer,
          isWeb ? styles.contentContainerWeb : styles.contentContainerNative,
        ]}
        showsVerticalScrollIndicator={isWeb}
        bounces={!isWeb}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, isWeb && styles.heroSectionWeb]}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/SakhiSetu_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appTitle, isWeb && styles.appTitleWeb]}>
            SakhiSetu
          </Text>
          <Text style={[styles.tagline, isWeb && styles.taglineWeb]}>
            Your Maternal Health Companion
          </Text>
          <Text
            style={[styles.description, isWeb && styles.descriptionWeb]}
            numberOfLines={isWeb ? 2 : undefined}
          >
            Comprehensive support for pregnancy, postpartum, and newborn care.
            Track your cycle, understand symptoms, and access wellness resources
            for every stage.
          </Text>
        </View>

        {/* Features Section */}
        <View
          style={[styles.featuresSection, isWeb && styles.featuresSectionWeb]}
        >
          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>
            Key Features
          </Text>

          <View
            style={[
              styles.featuresGrid,
              isDesktop && styles.featuresGridDesktop,
              isTablet && styles.featuresGridTablet,
            ]}
            className={isWeb && isTablet ? "feature-grid" : undefined}
          >
            <View
              style={[
                styles.featureCard,
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[0] && styles.featureCardHover,
              ]}
              onMouseEnter={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 0: true })
              }
              onMouseLeave={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 0: false })
              }
            >
              <View style={styles.featureIcon}>
                <Ionicons name="heart" size={isWeb ? 20 : 28} color="#e91e63" />
              </View>
              <View style={styles.featureContent}>
                <Text
                  style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}
                >
                  Maternal Wellness
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.featureCard,
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[1] && styles.featureCardHover,
              ]}
              onMouseEnter={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 1: true })
              }
              onMouseLeave={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 1: false })
              }
            >
              <View style={styles.featureIcon}>
                <Ionicons
                  name="calendar"
                  size={isWeb ? 20 : 28}
                  color="#2196f3"
                />
              </View>
              <View style={styles.featureContent}>
                <Text
                  style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}
                >
                  Cycle Tracking
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.featureCard,
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[2] && styles.featureCardHover,
              ]}
              onMouseEnter={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 2: true })
              }
              onMouseLeave={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 2: false })
              }
            >
              <View style={styles.featureIcon}>
                <Ionicons
                  name="people"
                  size={isWeb ? 20 : 28}
                  color="#4caf50"
                />
              </View>
              <View style={styles.featureContent}>
                <Text
                  style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}
                >
                  Community Support
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.featureCard,
                isWeb && styles.featureCardWeb,
                isWeb && featureHovers[3] && styles.featureCardHover,
              ]}
              onMouseEnter={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 3: true })
              }
              onMouseLeave={() =>
                isWeb && setFeatureHovers({ ...featureHovers, 3: false })
              }
            >
              <View style={styles.featureIcon}>
                <Ionicons name="book" size={isWeb ? 20 : 28} color="#ff9800" />
              </View>
              <View style={styles.featureContent}>
                <Text
                  style={[styles.featureTitle, isWeb && styles.featureTitleWeb]}
                >
                  Educational Content
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
              isWeb && buttonHover && styles.getStartedButtonHover,
            ]}
            onPress={handleGetStarted}
            onMouseEnter={() => isWeb && setButtonHover(true)}
            onMouseLeave={() => isWeb && setButtonHover(false)}
          >
            <Text
              style={[
                styles.getStartedButtonText,
                isWeb && styles.getStartedButtonTextWeb,
              ]}
            >
              Get Started
            </Text>
            <Ionicons
              name="arrow-forward"
              size={isWeb ? 16 : 20}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, isWeb && styles.footerWeb]}>
          <View style={styles.footerLinks}>
            <WebLink
              href="https://www.sakhisetu.in/PrivacyPolicy"
              onPress={handlePrivacyPolicy}
              style={[
                styles.footerLinkText,
                isWeb && styles.footerLinkTextWeb,
                isWeb && privacyHover && styles.footerLinkTextHover,
              ]}
            >
              Privacy Policy
            </WebLink>
            <Text
              style={[
                styles.footerLinkSeparator,
                isWeb && styles.footerLinkSeparatorWeb,
              ]}
            >
              •
            </Text>
            <WebLink
              href="https://www.sakhisetu.in/TermsOfService"
              onPress={handleTermsOfService}
              style={[
                styles.footerLinkText,
                isWeb && styles.footerLinkTextWeb,
                isWeb && termsHover && styles.footerLinkTextHover,
              ]}
            >
              Terms of Service
            </WebLink>
          </View>
          <Text style={[styles.copyright, isWeb && styles.copyrightWeb]}>
            © 2026 SakhiSetu. All rights reserved.
          </Text>
        </View>
      </ScrollView>
      </View>
    </>
  );
}

const isWeb = Platform.OS === "web";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerWeb: {
    width: "100%",
    flex: 1,
    minHeight: "100vh",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewWeb: {
    width: "100%",
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: isWeb ? 16 : 30,
  },
  contentContainerWeb: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  contentContainerNative: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  // Mobile-first: keep vertical spacing tight so everything fits
  heroSection: {
    alignItems: "center",
    paddingTop: isWeb ? 8 : 16,
    paddingBottom: isWeb ? 6 : 8,
    paddingHorizontal: isWeb ? 12 : 12,
  },
  heroSectionWeb: {
    width: "100%",
    paddingTop: 4,
    paddingBottom: 4,
  },
  logoContainer: {
    marginTop: isWeb ? 0 : 14,
    marginBottom: isWeb ? 4 : 6,
  },
  logo: {
    width: isWeb ? 56 : 80,
    height: isWeb ? 56 : 80,
  },
  appTitle: {
    fontSize: isWeb ? 22 : 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: isWeb ? 2 : 12,
    textAlign: "center",
  },
  appTitleWeb: {
    fontSize: 22,
  },
  tagline: {
    fontSize: isWeb ? 13 : 13,
    color: "#666",
    marginBottom: isWeb ? 4 : 20,
    textAlign: "center",
    fontWeight: "500",
  },
  taglineWeb: {
    fontSize: 13,
  },
  description: {
    fontSize: isWeb ? 11 : 12,
    color: "#666",
    textAlign: "center",
    lineHeight: isWeb ? 15 : 24,
    maxWidth: 600,
  },
  descriptionWeb: {
    fontSize: 11,
    lineHeight: 15,
    maxWidth: 520,
  },
  featuresSection: {
    paddingHorizontal: isWeb ? 0 : 12,
    paddingVertical: isWeb ? 6 : 8,
  },
  featuresSectionWeb: {
    width: "100%",
    paddingVertical: 4,
  },
  featuresGrid: {
    width: "100%",
  },
  featuresGridDesktop: {
    // Grid layout handled by CSS
  },
  featuresGridTablet: {
    // Can add tablet-specific styles if needed
  },
  sectionTitle: {
    fontSize: isWeb ? 15 : 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: isWeb ? 6 : 30,
    textAlign: "center",
  },
  sectionTitleWeb: {
    fontSize: 15,
  },
  featureCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: isWeb ? 8 : 10,
    padding: isWeb ? 8 : 10,
    marginBottom: isWeb ? 6 : 6,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureCardWeb: {
    transition: "all 0.3s ease",
    cursor: "default",
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
    width: isWeb ? 32 : 36,
    height: isWeb ? 32 : 36,
    borderRadius: isWeb ? 16 : 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isWeb ? 8 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: isWeb ? 13 : 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: isWeb ? 0 : 8,
    flex: 1,
  },
  featureTitleWeb: {
    fontSize: 13,
  },
  featureDescription: {
    fontSize: isWeb ? 11 : 11,
    color: "#666",
    lineHeight: isWeb ? 14 : 22,
    flex: 1,
  },
  featureDescriptionWeb: {
    fontSize: 11,
    lineHeight: 14,
  },
  ctaSection: {
    paddingHorizontal: isWeb ? 0 : 12,
    paddingVertical: isWeb ? 8 : 10,
    alignItems: "center",
  },
  ctaSectionWeb: {
    width: "100%",
    paddingVertical: 6,
  },
  getStartedButton: {
    backgroundColor: "#e91e63",
    paddingVertical: isWeb ? 8 : 10,
    paddingHorizontal: isWeb ? 20 : 22,
    borderRadius: isWeb ? 8 : 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedButtonWeb: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    userSelect: "none",
  },
  getStartedButtonHover: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  getStartedButtonText: {
    color: "#fff",
    fontSize: isWeb ? 14 : 14,
    fontWeight: "bold",
  },
  getStartedButtonTextWeb: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: isWeb ? 0 : 12,
    paddingVertical: isWeb ? 10 : 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: isWeb ? 4 : 8,
  },
  footerWeb: {
    width: "100%",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isWeb ? 4 : 4,
    flexWrap: "wrap",
  },
  footerLink: {
    paddingHorizontal: isWeb ? 8 : 4,
  },
  footerLinkText: {
    color: "#2196f3",
    fontSize: isWeb ? 11 : 16,
    textDecorationLine: "underline",
  },
  footerLinkTextWeb: {
    fontSize: 11,
    cursor: "pointer",
    transition: "color 0.2s ease",
    userSelect: "none",
  },
  footerLinkTextHover: {
    color: "#1976d2",
  },
  footerLinkSeparator: {
    color: "#999",
    fontSize: isWeb ? 11 : 13,
    marginHorizontal: isWeb ? 6 : 6,
  },
  footerLinkSeparatorWeb: {
    fontSize: 11,
  },
  copyright: {
    fontSize: isWeb ? 10 : 14,
    color: "#999",
    textAlign: "center",
  },
  copyrightWeb: {
    fontSize: 10,
  },
});

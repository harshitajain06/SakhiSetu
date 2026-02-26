import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicy() {
  const navigation = useNavigation();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      {isWeb && (
        <style>{`
          .privacy-scroll-container > div {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
          .privacy-scroll-container > div::-webkit-scrollbar {
            width: 8px;
          }
          .privacy-scroll-container > div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .privacy-scroll-container > div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .privacy-scroll-container > div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      )}
      <View style={[styles.header, isWeb && styles.headerWeb]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={isWeb ? 24 : 28} color="#333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isWeb && styles.headerTitleWeb]}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        className={isWeb ? 'privacy-scroll-container' : undefined}
        showsVerticalScrollIndicator={!isWeb}
      >
        <View style={[styles.content, isWeb && styles.contentWeb]}>
          <Text style={[styles.title, isWeb && styles.titleWeb]}>Privacy Policy</Text>
          <Text style={[styles.lastUpdated, isWeb && styles.lastUpdatedWeb]}>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>1. Introduction</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            Welcome to SakhiSetu ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>2. Information We Collect</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Personal information such as your name, email address, and date of birth
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Health-related information including menstrual cycle data, pregnancy information, and health symptoms
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Location data when you use features that require location services
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Usage data and analytics to improve our services
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>3. How We Use Your Information</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Provide, maintain, and improve our services
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Personalize your experience and provide relevant health information
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Send you important updates and notifications
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Analyze usage patterns to enhance app functionality
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Ensure the security and integrity of our services
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>4. Data Storage and Security</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We use Firebase, a secure cloud-based platform, to store your data. We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>5. Data Sharing and Disclosure</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • With your explicit consent
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • To comply with legal obligations
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • To protect our rights and prevent fraud
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • With service providers who assist us in operating our app (under strict confidentiality agreements)
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>6. Your Rights</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            You have the right to:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Access and review your personal information
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Correct inaccurate or incomplete information
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Request deletion of your account and data
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Opt-out of certain data collection practices
          </Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>7. Children's Privacy</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>8. Changes to This Privacy Policy</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>9. Contact Us</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </Text>
          <Text style={[styles.contactInfo, isWeb && styles.contactInfoWeb]}>
            Email: support@sakhisetu.in{'\n'}
            Website: https://www.sakhisetu.in
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.footerText, isWeb && styles.footerTextWeb]}>
              By using SakhiSetu, you acknowledge that you have read and understood this Privacy Policy.
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isWeb ? 20 : 16,
    paddingTop: isWeb ? 16 : 10,
    paddingBottom: isWeb ? 12 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerWeb: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  backButton: {
    padding: isWeb ? 8 : 4,
  },
  headerTitle: {
    fontSize: isWeb ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitleWeb: {
    fontSize: 22,
  },
  placeholder: {
    width: isWeb ? 40 : 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: isWeb ? 30 : 40,
  },
  content: {
    paddingHorizontal: isWeb ? 20 : 16,
    paddingTop: isWeb ? 24 : 20,
    paddingBottom: isWeb ? 20 : 24,
  },
  contentWeb: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: isWeb ? 32 : 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isWeb ? 8 : 12,
  },
  titleWeb: {
    fontSize: 34,
  },
  lastUpdated: {
    fontSize: isWeb ? 14 : 13,
    color: '#666',
    marginBottom: isWeb ? 24 : 28,
    fontStyle: 'italic',
  },
  lastUpdatedWeb: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: isWeb ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: isWeb ? 20 : 24,
    marginBottom: isWeb ? 10 : 12,
  },
  sectionTitleWeb: {
    fontSize: 22,
  },
  paragraph: {
    fontSize: isWeb ? 15 : 14,
    color: '#666',
    lineHeight: isWeb ? 24 : 22,
    marginBottom: isWeb ? 12 : 16,
    textAlign: 'justify',
  },
  paragraphWeb: {
    fontSize: 16,
  },
  bulletPoint: {
    fontSize: isWeb ? 15 : 14,
    color: '#666',
    lineHeight: isWeb ? 24 : 22,
    marginBottom: isWeb ? 8 : 10,
    marginLeft: isWeb ? 16 : 12,
  },
  bulletPointWeb: {
    fontSize: 16,
  },
  contactInfo: {
    fontSize: isWeb ? 15 : 14,
    color: '#333',
    lineHeight: isWeb ? 24 : 22,
    marginTop: isWeb ? 8 : 10,
    marginBottom: isWeb ? 12 : 16,
    fontWeight: '500',
  },
  contactInfoWeb: {
    fontSize: 16,
  },
  footer: {
    marginTop: isWeb ? 30 : 40,
    paddingTop: isWeb ? 20 : 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: isWeb ? 14 : 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footerTextWeb: {
    fontSize: 15,
  },
});

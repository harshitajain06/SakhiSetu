import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TermsOfService() {
  const navigation = useNavigation();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      {isWeb && (
        <style>{`
          .terms-scroll-container > div {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
          .terms-scroll-container > div::-webkit-scrollbar {
            width: 8px;
          }
          .terms-scroll-container > div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .terms-scroll-container > div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .terms-scroll-container > div::-webkit-scrollbar-thumb:hover {
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
        <Text style={[styles.headerTitle, isWeb && styles.headerTitleWeb]}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        className={isWeb ? 'terms-scroll-container' : undefined}
        showsVerticalScrollIndicator={!isWeb}
      >
        <View style={[styles.content, isWeb && styles.contentWeb]}>
          <Text style={[styles.title, isWeb && styles.titleWeb]}>Terms of Service</Text>
          <Text style={[styles.lastUpdated, isWeb && styles.lastUpdatedWeb]}>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>1. Acceptance of Terms</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            By accessing and using SakhiSetu ("the App", "we", "us", or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>2. Description of Service</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            SakhiSetu is a mobile and web application designed to provide maternal and menstrual health support, including but not limited to:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Pregnancy tracking and monitoring
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Menstrual cycle tracking
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Health information and educational content
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Community resources and support
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Health insights and analytics
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>3. User Accounts</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            To access certain features of the App, you must register for an account. You agree to:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Provide accurate, current, and complete information during registration
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Maintain and update your account information to keep it accurate
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Maintain the security of your password and account
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Accept responsibility for all activities that occur under your account
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Notify us immediately of any unauthorized use of your account
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>4. Medical Disclaimer</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            IMPORTANT: SakhiSetu is not a medical service, and the information provided in the App is for informational and educational purposes only. The App does not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this App.
          </Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            The App is not intended to be a substitute for professional medical advice, diagnosis, or treatment. If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>5. User Responsibilities</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Use the App in any way that violates any applicable law or regulation
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Transmit any malicious code, viruses, or harmful data
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Attempt to gain unauthorized access to the App or its systems
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Interfere with or disrupt the App or servers connected to the App
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Use the App to collect or store personal data about other users
          </Text>
          <Text style={[styles.bulletPoint, isWeb && styles.bulletPointWeb]}>
            • Impersonate any person or entity or misrepresent your affiliation
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>6. Intellectual Property</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            The App and its original content, features, and functionality are owned by SakhiSetu and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our services or included software.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>7. Privacy</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            Your use of the App is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs your use of the App, to understand our practices regarding the collection and use of your information.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>8. Limitation of Liability</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            To the maximum extent permitted by law, SakhiSetu shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the App.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>9. Disclaimer of Warranties</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            The App is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the App or the information, content, materials, or products included in the App.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>10. Termination</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We may terminate or suspend your account and access to the App immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the App will immediately cease.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>11. Changes to Terms</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>12. Governing Law</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </Text>

          <Text style={[styles.sectionTitle, isWeb && styles.sectionTitleWeb]}>13. Contact Information</Text>
          <Text style={[styles.paragraph, isWeb && styles.paragraphWeb]}>
            If you have any questions about these Terms of Service, please contact us at:
          </Text>
          <Text style={[styles.contactInfo, isWeb && styles.contactInfoWeb]}>
            Email: support@sakhisetu.in{'\n'}
            Website: https://www.sakhisetu.in
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.footerText, isWeb && styles.footerTextWeb]}>
              By using SakhiSetu, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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

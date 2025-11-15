import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ContentIllustration from './components/ContentIllustration';

export default function WellbeingConfidenceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Content not found</Text>
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
        <Text style={styles.headerTitle}>Well-being & Confidence</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <ContentIllustration imageType={item.imageType} category="wellbeing" />
      </View>

      {/* Content Section */}
      <View style={styles.section}>
        <Text style={styles.contentText}>{item.content}</Text>
      </View>

      {/* Tips Section */}
      {item.tips && item.tips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Key Tips</Text>
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
            <Ionicons name="information-circle" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Important Note</Text>
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
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 8,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  noteContainer: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
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


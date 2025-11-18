import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MenstrualLearnScreen() {
  const navigation = useNavigation();
  const modules = [
    {
      id: 1,
      title: 'Your Journey to Understanding',
      description: 'Explore the basics of menstrual health and well-being.',
      icon: 'heart',
      iconColor: '#e91e63',
      contentType: 'Videos',
      route: 'JourneyToUnderstanding'
    },
    {
      id: 2,
      title: 'Myths & Facts',
      description: 'Separate common beliefs from medical truths about menstruation.',
      icon: 'bulb',
      iconColor: '#FFC107',
      contentType: 'Images and Text',
      route: 'MythsAndFacts'
    },
    {
      id: 3,
      title: 'Staying Clean',
      description: 'Guidance on hygiene practices during your menstrual cycle.',
      icon: 'water',
      iconColor: '#2196F3',
      contentType: 'Images and Text',
      route: 'StayingClean'
    },
    {
      id: 4,
      title: 'Well-being & Confidence',
      description: 'Tips for managing mood and staying confident during periods.',
      icon: 'barbell',
      iconColor: '#4CAF50',
      contentType: 'Images and Text',
      route: 'WellbeingConfidence'
    },
    {
      id: 5,
      title: 'Health Diet & Care',
      description: 'Nutrition advice and self-care tips for menstrual health.',
      icon: 'restaurant',
      iconColor: '#FF9800',
      contentType: 'Videos',
      route: 'HealthDietCare'
    },
  ];

  const handleModulePress = (module) => {
    if (module.route === 'MythsAndFacts') {
      navigation.navigate('MythsAndFactsList');
    } else if (module.route === 'JourneyToUnderstanding') {
      navigation.navigate('JourneyToUnderstanding');
    } else if (module.route === 'StayingClean') {
      navigation.navigate('StayingCleanList');
    } else if (module.route === 'WellbeingConfidence') {
      navigation.navigate('WellbeingConfidenceList');
    } else if (module.route === 'HealthDietCare') {
      navigation.navigate('HealthDietCare');
    } else {
      // Handle other module navigations here
      console.log('Navigate to:', module.route);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menstrual Health</Text>
      </View>

      {/* Explore Modules Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore Modules</Text>
        <View style={styles.modulesGrid}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handleModulePress(module)}
              activeOpacity={0.7}
            >
              <View style={[styles.moduleIconContainer, { backgroundColor: `${module.iconColor}15` }]}>
              <Ionicons 
                  name={module.icon} 
                  size={32} 
                  color={module.iconColor}
                />
              </View>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Understanding Your Cycle Section */}
      {/* <View style={styles.cycleSection}>
        <View style={[styles.cycleIconContainer, { backgroundColor: '#e91e6315' }]}>
          <Ionicons name="help-circle" size={40} color="#e91e63" />
        </View>
        <Text style={styles.cycleTitle}>Understanding Your Cycle</Text>
        <View style={styles.cycleImageContainer}>
          <View style={styles.cycleImagePlaceholder}>
            <Ionicons name="flower" size={48} color="#e91e63" />
          </View>
        </View>
        <Text style={styles.cycleDescription}>
          Learn how to track your menstrual cycle and recognize its unique patterns and signs. 
          Knowledge empowers you to better manage your health.
        </Text>
        <TouchableOpacity style={styles.diveDeeperButton} activeOpacity={0.8}>
          <Text style={styles.diveDeeperText}>Dive Deeper</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moduleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  moduleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  cycleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  cycleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cycleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  cycleImageContainer: {
    width: '100%',
    marginBottom: 16,
  },
  cycleImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cycleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  diveDeeperButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 140,
  },
  diveDeeperText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

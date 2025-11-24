import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LearnScreen() {
  const navigation = useNavigation();
  const modules = [
    {
      id: 1,
      title: 'Pregnancy Basics',
      description: 'Understanding the fundamentals of pregnancy and what to expect.',
      icon: 'heart',
      iconColor: '#e91e63',
      contentType: 'Videos',
      route: 'PregnancyBasics'
    },
    {
      id: 2,
      title: 'Prenatal Care',
      description: 'Essential healthcare practices during your pregnancy journey.',
      icon: 'medical',
      iconColor: '#2196F3',
      contentType: 'Images and Text',
      route: 'PrenatalCare'
    },
    {
      id: 3,
      title: 'Nutrition & Diet',
      description: 'Healthy eating habits and nutritional needs during pregnancy.',
      icon: 'restaurant',
      iconColor: '#4CAF50',
      contentType: 'Videos',
      route: 'NutritionDiet'
    },
    {
      id: 4,
      title: 'Postpartum Care',
      description: 'Recovery and self-care after giving birth.',
      icon: 'flower',
      iconColor: '#FF9800',
      contentType: 'Images and Text',
      route: 'PostpartumCare'
    },
    {
      id: 5,
      title: 'Newborn Care',
      description: 'Essential tips for caring for your newborn baby.',
      icon: 'baby',
      iconColor: '#9C27B0',
      contentType: 'Videos',
      route: 'NewbornCare'
    },
    {
      id: 6,
      title: 'Breastfeeding Guide',
      description: 'Comprehensive guide to successful breastfeeding.',
      icon: 'water',
      iconColor: '#00BCD4',
      contentType: 'Images and Text',
      route: 'BreastfeedingGuide'
    },
    {
      id: 7,
      title: 'Maternal Wellness',
      description: 'Mental health and emotional well-being during and after pregnancy.',
      icon: 'happy',
      iconColor: '#FFC107',
      contentType: 'Videos',
      route: 'MaternalWellness'
    },
    {
      id: 8,
      title: 'Exercise & Fitness',
      description: 'Safe exercise routines and staying active during pregnancy.',
      icon: 'barbell',
      iconColor: '#F44336',
      contentType: 'Images and Text',
      route: 'ExerciseFitness'
    },
  ];

  const handleModulePress = (module) => {
    console.log('Module pressed:', module.title, module.route);
    try {
      if (module.route === 'PrenatalCare') {
        navigation.navigate('PrenatalCareList');
      } else if (module.route === 'PostpartumCare') {
        navigation.navigate('PostpartumCareList');
      } else if (module.route === 'BreastfeedingGuide') {
        navigation.navigate('BreastfeedingGuideList');
      } else if (module.route === 'ExerciseFitness') {
        navigation.navigate('ExerciseFitnessList');
      } else if (module.route === 'PregnancyBasics') {
        // Navigate to pregnancy basics list screen
        navigation.navigate('PregnancyBasics');
      } else if (module.route === 'NutritionDiet') {
        // Navigate to nutrition diet list screen
        navigation.navigate('NutritionDiet');
      } else if (module.route === 'NewbornCare') {
        // Navigate to newborn care list screen
        navigation.navigate('NewbornCare');
      } else if (module.route === 'MaternalWellness') {
        // Navigate to maternal wellness list screen
        navigation.navigate('MaternalWellness');
      } else {
        // Handle other module navigations here
        console.log('Navigate to:', module.route);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maternal Health</Text>
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
              <Text style={styles.moduleTitle} pointerEvents="none">{module.title}</Text>
              <Text style={styles.moduleDescription} pointerEvents="none">{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Your Pregnancy Journey Section */}
      {/* <View style={styles.journeySection}>
        <View style={[styles.journeyIconContainer, { backgroundColor: '#e91e6315' }]}>
          <Ionicons name="calendar" size={40} color="#e91e63" />
        </View>
        <Text style={styles.journeyTitle}>Your Pregnancy Journey</Text>
        <View style={styles.journeyImageContainer}>
          <View style={styles.journeyImagePlaceholder}>
            <Ionicons name="heart" size={48} color="#e91e63" />
          </View>
        </View>
        <Text style={styles.journeyDescription}>
          Track your pregnancy milestones and understand the changes happening to your body. 
          Knowledge empowers you to make informed decisions for you and your baby's health.
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
    minHeight: 180,
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
  journeySection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  journeyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  journeyImageContainer: {
    width: '100%',
    marginBottom: 16,
  },
  journeyImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  journeyDescription: {
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

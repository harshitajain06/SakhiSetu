import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Image paths mapping for Staying Clean, Well-being, and Pregnancy sections
// Place images in: assets/images/stayingClean/, assets/images/wellbeing/, and assets/images/pregnancy/
// Only add require() statements for images that actually exist
// When you add an image, uncomment the corresponding require() line

// Image mapping - only include images that exist
const stayingCleanImages = {
  // Uncomment when images are added:
  'daily_hygiene': require('../../assets/images/stayingClean/daily_hygiene.png'),
  'sanitary_products': require('../../assets/images/stayingClean/sanitary_products.png'),
  'disposal': require('../../assets/images/stayingClean/disposal.png'),
  'prevent_infections': require('../../assets/images/stayingClean/prevent_infections.png'),
  'bathing': require('../../assets/images/stayingClean/bathing.png'),
  'managing_odor': require('../../assets/images/stayingClean/managing_odor.png'),
};

const wellbeingImages = {
  // Uncomment when images are added:
  'mood_changes': require('../../assets/images/wellbeing/mood_changes.png'),
  'managing_cramps': require('../../assets/images/wellbeing/managing_cramps.png'),
  'self_confidence': require('../../assets/images/wellbeing/self_confidence.png'),
  'staying_active': require('../../assets/images/wellbeing/staying_active.png'),
  'nutrition': require('../../assets/images/wellbeing/nutrition.png'),
  'stress_management': require('../../assets/images/wellbeing/stress_management.png'),
  'sleep_rest': require('../../assets/images/wellbeing/sleep_rest.png'),
};

// Pregnancy images - uncomment as you add images (BABY WEEK 1 through BABY WEEK 40)
const pregnancyImages = {
  // Uncomment when images are added:
  'week_1': require('../../assets/images/pregnancy/BABY WEEK 1.png'),
  'week_2': require('../../assets/images/pregnancy/BABY WEEK 2.png'),
  'week_3': require('../../assets/images/pregnancy/BABY WEEK 3.png'),
  'week_4': require('../../assets/images/pregnancy/BABY WEEK 4.png'),
  'week_5': require('../../assets/images/pregnancy/BABY WEEK 5.png'),
  'week_6': require('../../assets/images/pregnancy/BABY WEEK 6.png'),
  'week_7': require('../../assets/images/pregnancy/BABY WEEK 7.png'),
  'week_8': require('../../assets/images/pregnancy/BABY WEEK 8.png'),
  'week_9': require('../../assets/images/pregnancy/BABY WEEK 9.png'),
  'week_10': require('../../assets/images/pregnancy/BABY WEEK 10.png'),
  'week_11': require('../../assets/images/pregnancy/BABY WEEK 11.png'),
  'week_12': require('../../assets/images/pregnancy/BABY WEEK 12.png'),
  'week_13': require('../../assets/images/pregnancy/BABY WEEK 13.png'),
  'week_14': require('../../assets/images/pregnancy/BABY WEEK 14.png'),
  'week_15': require('../../assets/images/pregnancy/BABY WEEK 15.png'),
  'week_16': require('../../assets/images/pregnancy/BABY WEEK 16.png'),
  'week_17': require('../../assets/images/pregnancy/BABY WEEK 17.png'),
  'week_18': require('../../assets/images/pregnancy/BABY WEEK 18.png'),
  'week_19': require('../../assets/images/pregnancy/BABY WEEK 19.png'),
  'week_20': require('../../assets/images/pregnancy/BABY WEEK 20.png'),
  'week_21': require('../../assets/images/pregnancy/BABY WEEK 21.png'),
  'week_22': require('../../assets/images/pregnancy/BABY WEEK 22.png'),
  'week_23': require('../../assets/images/pregnancy/BABY WEEK 23.png'),
  'week_24': require('../../assets/images/pregnancy/BABY WEEK 24.png'),
  'week_25': require('../../assets/images/pregnancy/BABY WEEK 25.png'),
  'week_26': require('../../assets/images/pregnancy/BABY WEEK 26.png'),
  'week_27': require('../../assets/images/pregnancy/BABY WEEK 27.png'),
  'week_28': require('../../assets/images/pregnancy/BABY WEEK 28.png'),
  'week_29': require('../../assets/images/pregnancy/BABY WEEK 29.png'),
  'week_30': require('../../assets/images/pregnancy/BABY WEEK 30.png'),
  'week_31': require('../../assets/images/pregnancy/BABY WEEK 31.png'),
  'week_32': require('../../assets/images/pregnancy/BABY WEEK 32.png'),
  'week_33': require('../../assets/images/pregnancy/BABY WEEK 33.png'),
  'week_34': require('../../assets/images/pregnancy/BABY WEEK 34.png'),
  'week_35': require('../../assets/images/pregnancy/BABY WEEK 35.png'),
  'week_36': require('../../assets/images/pregnancy/BABY WEEK 36.png'),
  'week_37': require('../../assets/images/pregnancy/BABY WEEK 37.png'),
  'week_38': require('../../assets/images/pregnancy/BABY WEEK 38.png'),
  'week_39': require('../../assets/images/pregnancy/BABY WEEK 39.png'),
  'week_40': require('../../assets/images/pregnancy/BABY WEEK 40.png'),
};

const getImageSource = (imageType, category) => {
  if (category === 'stayingClean') {
    return stayingCleanImages[imageType] || null;
  } else if (category === 'wellbeing') {
    return wellbeingImages[imageType] || null;
  } else if (category === 'pregnancy') {
    return pregnancyImages[imageType] || null;
  }
  return null;
};

export default function ContentIllustration({ imageType = 'default', category = 'stayingClean' }) {
  const imageSource = getImageSource(imageType, category);

  // If image exists, display it
  if (imageSource) {
    return (
      <View style={styles.container}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Fallback placeholder if image doesn't exist
  return (
    <View style={styles.placeholderContainer}>
      <Ionicons name="image-outline" size={48} color="#ccc" />
      <Text style={styles.placeholderText}>
        Image not available
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
});


import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Image paths mapping for Staying Clean and Well-being sections
// Place images in: assets/images/stayingClean/ and assets/images/wellbeing/
// Only add require() statements for images that actually exist
// When you add an image, uncomment the corresponding require() line

// Image mapping - only include images that exist
const stayingCleanImages = {
  // Uncomment when images are added:
  // 'daily_hygiene': require('../../assets/images/stayingClean/daily_hygiene.png'),
  // 'sanitary_products': require('../../assets/images/stayingClean/sanitary_products.png'),
  // 'disposal': require('../../assets/images/stayingClean/disposal.png'),
  // 'prevent_infections': require('../../assets/images/stayingClean/prevent_infections.png'),
  // 'bathing': require('../../assets/images/stayingClean/bathing.png'),
  // 'managing_odor': require('../../assets/images/stayingClean/managing_odor.png'),
};

const wellbeingImages = {
  // Uncomment when images are added:
  // 'mood_changes': require('../../assets/images/wellbeing/mood_changes.png'),
  // 'managing_cramps': require('../../assets/images/wellbeing/managing_cramps.png'),
  // 'self_confidence': require('../../assets/images/wellbeing/self_confidence.png'),
  // 'staying_active': require('../../assets/images/wellbeing/staying_active.png'),
  // 'nutrition': require('../../assets/images/wellbeing/nutrition.png'),
  // 'stress_management': require('../../assets/images/wellbeing/stress_management.png'),
  // 'sleep_rest': require('../../assets/images/wellbeing/sleep_rest.png'),
};

const getImageSource = (imageType, category) => {
  if (category === 'stayingClean') {
    return stayingCleanImages[imageType] || null;
  } else if (category === 'wellbeing') {
    return wellbeingImages[imageType] || null;
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
    backgroundColor: '#f5f5f5',
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


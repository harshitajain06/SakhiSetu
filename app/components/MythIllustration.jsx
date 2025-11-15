import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Image paths mapping - Update these paths when actual images are added
// Place images in: assets/images/myths/
const getImageSource = (imageType) => {
  // Try to require the image, return null if it doesn't exist
  try {
    switch (imageType) {
      case 'temple_sign':
        return require('../../assets/images/myths/temple_sign.png');
      case 'pickles':
        return require('../../assets/images/myths/pickles.png');
      case 'period_power':
        return require('../../assets/images/myths/period_power.png');
      case 'soccer_girl':
        return require('../../assets/images/myths/soccer_girl.png');
      case 'hair_wash':
        return require('../../assets/images/myths/hair_wash.png');
      case 'bed_person':
        return require('../../assets/images/myths/bed_person.png');
      case 'foods_avoid':
        return require('../../assets/images/myths/foods_avoid.png');
      case 'kitchen_cooking':
        return require('../../assets/images/myths/kitchen_cooking.png');
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
};

export default function MythIllustration({ imageType = 'default' }) {
  const imageSource = getImageSource(imageType);

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

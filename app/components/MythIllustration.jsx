import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Image paths mapping - Update these paths when actual images are added
// Place images in: assets/images/myths/
const mythImages = {
  'temple_sign': require('../../assets/images/myths/temple_sign.png'),
  'pickles': require('../../assets/images/myths/pickles.png'),
  'period_power': require('../../assets/images/myths/period_power.png'),
  'soccer_girl': require('../../assets/images/myths/soccer_girl.png'),
  'hair_wash': require('../../assets/images/myths/hair_wash.png'),
  'bed_person': require('../../assets/images/myths/bed_person.png'),
  'foods_avoid': require('../../assets/images/myths/foods_avoid.png'),
  'kitchen_cooking': require('../../assets/images/myths/kitchen_cooking.png'),
};

const getImageSource = (imageType) => {
  return mythImages[imageType] || null;
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
    backgroundColor: 'transparent',
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

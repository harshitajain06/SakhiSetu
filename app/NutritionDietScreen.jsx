import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function NutritionDietScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // Automatically navigate to the list screen
    navigation.replace('NutritionDietList');
  }, [navigation]);

  return null;
}


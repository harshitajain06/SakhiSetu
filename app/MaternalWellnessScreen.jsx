import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function MaternalWellnessScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // Automatically navigate to the list screen
    navigation.replace('MaternalWellnessList');
  }, [navigation]);

  return null;
}


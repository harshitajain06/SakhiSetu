import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function NewbornCareScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // Automatically navigate to the list screen
    navigation.replace('NewbornCareList');
  }, [navigation]);

  return null;
}


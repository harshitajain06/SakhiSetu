import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function PregnancyBasicsScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    // Automatically navigate to the list screen
    navigation.replace('PregnancyBasicsList');
  }, [navigation]);

  return null;
}


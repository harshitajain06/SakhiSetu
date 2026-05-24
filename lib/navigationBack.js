import { Platform } from 'react-native';

/** Go back in the stack, or return to the landing screen (needed on web after full-page loads). */
export function goBackOrLanding(navigation, landingRoute = 'LandingPage') {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back();
    return;
  }

  navigation.navigate(landingRoute);
}

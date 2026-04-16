import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { app } from '../config/firebase';
import { TranslationProvider } from '../contexts/TranslationContext';
import MainLayout from './MainLayout';
import { ensureFcmPermission, registerFcmListeners, syncFcmTokenToFirestore } from './utils/fcm';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;

    let cleanup = () => {};

    (async () => {
      try {
        const { enabled } = await ensureFcmPermission();
        if (enabled) {
          await syncFcmTokenToFirestore();
        }

        cleanup = registerFcmListeners({
          onOpenNotification: (_remoteMessage: unknown) => {
            // Later: route the user to PeriodTracker / VaccinationTracker based on data payload.
            // We keep this hook so backend can include navigation targets in `remoteMessage.data`.
          },
        });
      } catch {
        // ignore
      }
    })();

    return () => cleanup();
  }, [loaded]);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(app), async () => {
      try {
        const { enabled } = await ensureFcmPermission();
        if (enabled) await syncFcmTokenToFirestore();
      } catch {
        // ignore
      }
    });
    return unsub;
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <TranslationProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <MainLayout />
          <Toast />
          <StatusBar style="auto" />
        </ThemeProvider>
      </TranslationProvider>
    </SafeAreaProvider>
  );
}

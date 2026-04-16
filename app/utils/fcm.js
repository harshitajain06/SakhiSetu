import { Platform, PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const messaging = getMessaging();

/** Android 13+ (API 33): runtime permission; without it the system never shows a notification prompt for FCM. */
async function requestAndroidPostNotificationsIfNeeded() {
  if (Platform.OS !== 'android') return true;
  if (typeof Platform.Version !== 'number' || Platform.Version < 33) return true;

  const perm = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  const already = await PermissionsAndroid.check(perm);
  if (already) return true;

  const result = await PermissionsAndroid.request(perm, {
    title: 'Enable notifications',
    message: 'SakhiSetu sends reminders for periods and child vaccinations. Allow notifications to receive them.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

/** In-app banner when a push arrives while the app is foregrounded (FCM does not show a system tray banner then). */
function presentForegroundFromRemoteMessage(remoteMessage) {
  if (Platform.OS === 'web') return;

  // Delayed test is meant as a real tray notification; skip in-app toast if user still has app open.
  if (remoteMessage.data?.type === 'test_scheduled') return;

  const n = remoteMessage.notification;
  const title = (n?.title ?? remoteMessage.data?.title ?? '').trim() || 'SakhiSetu';
  const body = (n?.body ?? remoteMessage.data?.body ?? '').trim();
  if (!title && !body) return;

  Toast.show({
    type: 'info',
    text1: title,
    text2: body || undefined,
    visibilityTime: 4500,
  });
}

export async function ensureFcmPermission() {
  if (Platform.OS === 'web') return { enabled: false, status: 'web_unsupported' };

  const androidOk = await requestAndroidPostNotificationsIfNeeded();
  if (Platform.OS === 'android' && !androidOk) {
    return { enabled: false, status: AuthorizationStatus.DENIED };
  }

  const currentStatus = await hasPermission(messaging);
  const alreadyOk =
    currentStatus === AuthorizationStatus.AUTHORIZED ||
    currentStatus === AuthorizationStatus.PROVISIONAL;

  if (alreadyOk) return { enabled: true, status: currentStatus };

  const nextStatus =
    Platform.OS === 'ios'
      ? await requestPermission(messaging, {
          alert: true,
          badge: true,
          sound: true,
          announcement: false,
          carPlay: false,
          criticalAlert: false,
          provisional: false,
        })
      : await requestPermission(messaging);

  const nextEnabled =
    nextStatus === AuthorizationStatus.AUTHORIZED ||
    nextStatus === AuthorizationStatus.PROVISIONAL;

  return { enabled: nextEnabled, status: nextStatus };
}

export async function syncFcmTokenToFirestore() {
  if (Platform.OS === 'web') return null;

  const user = auth.currentUser;
  if (!user) return null;

  const token = await getToken(messaging);
  if (!token) return null;

  const tokenRef = doc(db, 'users', user.uid, 'fcmTokens', token);
  await setDoc(
    tokenRef,
    {
      token,
      platform: Platform.OS,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return token;
}

export function registerFcmListeners({ onOpenNotification } = {}) {
  if (Platform.OS === 'web') return () => {};

  const unsubOnMessage = onMessage(messaging, (remoteMessage) => {
    try {
      presentForegroundFromRemoteMessage(remoteMessage);
    } catch (e) {
      console.warn('FCM foreground notification', e);
    }
  });

  const unsubOnOpen = onNotificationOpenedApp(messaging, (remoteMessage) => {
    if (onOpenNotification) onOpenNotification(remoteMessage);
  });

  getInitialNotification(messaging)
    .then((remoteMessage) => {
      if (remoteMessage && onOpenNotification) onOpenNotification(remoteMessage);
    })
    .catch(() => {});

  const unsubOnTokenRefresh = onTokenRefresh(messaging, async () => {
    try {
      await syncFcmTokenToFirestore();
    } catch {
      // ignore
    }
  });

  return () => {
    unsubOnMessage();
    unsubOnOpen();
    unsubOnTokenRefresh();
  };
}

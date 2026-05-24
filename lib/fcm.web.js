/** Web: FCM is native-only; stubs keep the root layout and screens importable on web. */

export async function ensureFcmPermission() {
  return { enabled: false, status: 'web_unsupported' };
}

export async function syncFcmTokenToFirestore() {
  return null;
}

export function registerFcmListeners() {
  return () => {};
}

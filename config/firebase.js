import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyADJMXZi1511N66jc6IiJ3qEKUCoZ6Li4w",
  authDomain: "sakhisetu-c413b.firebaseapp.com",
  projectId: "sakhisetu-c413b",
  storageBucket: "sakhisetu-c413b.firebasestorage.app",
  messagingSenderId: "992765354152",
  appId: "1:992765354152:web:f5503c173c732b23d3629d",
  measurementId: "G-9JLV4SYGNJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Use correct auth initialization based on platform
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // Use standard web auth
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);
export const usersRef = collection(db, 'users');

// Google OAuth Client IDs
// 
// WEB CLIENT ID:
// 1. Go to Firebase Console: https://console.firebase.google.com/
// 2. Select your project: sakhisetu-c413b
// 3. Go to Authentication > Sign-in method > Google
// 4. Copy the "Web client ID" (format: 992765354152-xxxxx.apps.googleusercontent.com)
// 
// ANDROID CLIENT ID:
// 1. Go to Google Cloud Console: https://console.cloud.google.com/
// 2. Select your project: sakhisetu-c413b
// 3. Go to APIs & Services > Credentials
// 4. Create OAuth 2.0 Client ID (Type: Android)
// 5. Package name: com.harshitaforever.SakhiSetu
// 6. SHA-1: Get from Play Console > App Integrity > App signing key certificate
// 7. Add the same SHA-1 in Firebase Console > Project Settings > Your Android App > Add fingerprint
// 
// IMPORTANT for Android Play Store:
// - SHA-1 must match between Google Cloud Console, Firebase, and Play Console
// - Without correct SHA-1, Play Store build WILL fail Google login
export const GOOGLE_OAUTH_CLIENT_ID_WEB = '992765354152-lkhnpr97ve4gs21jpr4ukidhobi1qbta.apps.googleusercontent.com';
export const GOOGLE_OAUTH_CLIENT_ID_ANDROID = '992765354152-coghrvha9g5h1mffabpg8env12ikqace.apps.googleusercontent.com';

// Export platform-specific client ID
// For native: Use WEB client ID (needed for @react-native-google-signin/google-signin)
// For web: Use WEB client ID (for Firebase signInWithPopup)
export const GOOGLE_OAUTH_CLIENT_ID = Platform.OS === 'web' 
  ? GOOGLE_OAUTH_CLIENT_ID_WEB 
  : GOOGLE_OAUTH_CLIENT_ID_WEB; // Native uses web client ID for GoogleSignin.configure
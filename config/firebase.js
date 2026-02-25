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

// Google OAuth Client ID for native sign-in
// To get this:
// 1. Go to Firebase Console: https://console.firebase.google.com/
// 2. Select your project: sakhisetu-c413b
// 3. Go to Authentication > Sign-in method > Google
// 4. Copy the "Web client ID" (format: 992765354152-xxxxx.apps.googleusercontent.com)
// 5. Replace the value below
// 
// IMPORTANT for Android Play Store:
// - Add your app's SHA-1 fingerprint to Firebase Console
// - For debug: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
// - For Play Store: Get SHA-1 from Play Console > Release > Setup > App Signing
// - Add SHA-1 in Firebase Console > Project Settings > Your Android App > Add fingerprint
export const GOOGLE_OAUTH_CLIENT_ID = '992765354152-lkhnpr97ve4gs21jpr4ukidhobi1qbta.apps.googleusercontent.com'; // TODO: Replace with your Web client ID from Firebase Console
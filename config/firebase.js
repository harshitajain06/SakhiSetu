import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDUg1w86z3fX9vJuT6bDR091B5H2rWPDMs",
  authDomain: "sakhisetu-7069d.firebaseapp.com",
  projectId: "sakhisetu-7069d",
  storageBucket: "sakhisetu-7069d.firebasestorage.app",
  messagingSenderId: "499574073381",
  appId: "1:499574073381:web:eeacbc20bbb7ec349f77cc",
  measurementId: "G-TYZXFL8J4R"
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

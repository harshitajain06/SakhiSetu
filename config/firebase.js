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

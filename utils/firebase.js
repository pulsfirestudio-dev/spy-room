// utils/firebase.js
// ⚠️  SETUP REQUIRED: Replace the placeholder values below with your Firebase config.
//
// Steps:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use an existing one)
// 3. Add a Web app to the project
// 4. Copy the firebaseConfig object shown and paste the values below
// 5. In Firestore Database → Rules, set:
//    allow read, write: if true;   (for development — tighten before going to production)

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw1sNNxitMFjCYER7cgt33k8ThzU1Zmv8",
  authDomain: "multiplier-spy-room.firebaseapp.com",
  projectId: "multiplier-spy-room",
  storageBucket: "multiplier-spy-room.firebasestorage.app",
  messagingSenderId: "837039155361",
  appId: "1:837039155361:web:c5294904271c1585a1e8e0",
  measurementId: "G-QB01NN60QK",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

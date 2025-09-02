// Firebase setup: Firestore + Messaging exports
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC4ZnmqkvMn5IW1fpfch4G8__eqO_--p-s',
  authDomain: 'sound-of-praise.firebaseapp.com',
  projectId: 'sound-of-praise',
  storageBucket: 'sound-of-praise.firebasestorage.app',
  messagingSenderId: '402038461389',
  appId: '1:402038461389:web:08aeaadb37c6c5bcf02a84',
  measurementId: 'G-5Q0F744E5X',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

// Messaging instance
const messaging = getMessaging(app);

export { app, db, messaging, getToken, onMessage };

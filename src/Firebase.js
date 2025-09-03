// Firebase v10+ modular SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC4ZnmqkvMn5IW1fpfch4G8__eqO_--p-s',
  authDomain: 'sound-of-praise.firebaseapp.com',
  projectId: 'sound-of-praise',
  storageBucket: 'sound-of-praise.firebasestorage.app',
  messagingSenderId: '402038461389',
  appId: '1:402038461389:web:08aeaadb37c6c5bcf02a84',
  measurementId: 'G-5Q0F744E5X'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support all of the features required to enable offline persistence');
  }
});

// Initialize other Firebase services here if needed
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';
// export const auth = getAuth(app);
// export const storage = getStorage(app);

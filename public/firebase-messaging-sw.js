/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC4ZnmqkvMn5IW1fpfch4G8__eqO_--p-s',
  authDomain: 'sound-of-praise.firebaseapp.com',
  projectId: 'sound-of-praise',
  storageBucket: 'sound-of-praise.firebasestorage.app',
  messagingSenderId: '402038461389',
  appId: '1:402038461389:web:08aeaadb37c6c5bcf02a84',
  measurementId: 'G-5Q0F744E5X',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'New Biginning Concert';
  const body = (payload.notification && payload.notification.body) ||
    `Thank you for coming.\nDate: Sunday 28th September 2025\nTime: 2:00 pm - 5:00 pm\nVenue: UON Main Campus\nHave a good time as you plan to come.\nFor confirmation or questions, call +254111872056 or email Re.fous@gmail.com`;

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  });
});

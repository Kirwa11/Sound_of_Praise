const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Admin SDK using default credentials from the environment
admin.initializeApp();

// Compose the notification title/body
function buildNotification() {
  const title = 'New Biginning Concert';
  const body = [
    'Thank you for coming.',
    'Date: Sunday 28th September 2025',
    'Time: 2:00 pm - 5:00 pm',
    'Venue: UON Main Campus',
    'Have a good time as you plan to come.',
    'For confirmation or questions, call +254111872056 or email Re.fous@gmail.com',
  ].join('\n');
  return { title, body };
}

// Trigger: when a new registration document is created, send a push to its fcmToken
exports.sendWelcomePush = functions.firestore
  .document('registrations/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const token = data.fcmToken;

    if (!token) {
      console.log('No fcmToken on document; skipping push. Doc ID:', context.params.docId);
      return null;
    }

    const { title, body } = buildNotification();

    const message = {
      token,
      notification: { title, body },
      // Optional: set a link to open when the notification is clicked
      webpush: {
        headers: { TTL: '3600' },
        fcmOptions: {
          // Provide your site URL if you want click-through behavior
          // link: 'https://your-site.example.com',
        },
      },
    };

    try {
      const resp = await admin.messaging().send(message);
      console.log('Push sent:', resp);
    } catch (err) {
      console.error('Error sending push:', err);
    }

    return null;
  });

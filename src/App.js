import React, { useState } from 'react';
import './App.css';
import { db, messaging, getToken } from './Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { EVENT_INFO, buildNotificationBody } from './config';

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    excited: '',
    source: '',
    otherSource: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const valid = (
      form.name &&
      form.email &&
      form.phone &&
      form.idNumber &&
      form.excited &&
      form.source &&
      (form.source !== 'other' || form.otherSource)
    );
    if (!valid) return;

    const payload = {
      ...form,
      source: form.source === 'other' ? form.otherSource : form.source,
    };

    // Get FCM token using your VAPID public key
    let fcmToken = '';
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        fcmToken = await getToken(messaging, {
          vapidKey: 'BKJImrpWaNAduRrYJDBg1BcvvTnMY41_C55qpyqy4UVEY3VeG3hDgPKJB8nisEtoirip5_rzsATOlXWYUgleRnc',
          serviceWorkerRegistration: swReg,
        });
        console.log('FCM token:', fcmToken);
      } else {
        console.warn('Notifications permission not granted');
      }
    } catch (err) {
      console.error('FCM token error:', err);
    }

    // Save to Firestore
    try {
      await addDoc(collection(db, 'registrations'), {
        ...payload,
        fcmToken,
        createdAt: serverTimestamp(),
      });
      console.log('Registration submitted:', payload);
    } catch (err) {
      console.error('Error saving registration:', err);
    }

    // Detailed success message using your event info
    const detailsMsg = `${EVENT_INFO.title}\n${buildNotificationBody()}`;
    setSuccessMsg(detailsMsg);

    setForm({ name: '', email: '', phone: '', idNumber: '', excited: '', source: '', otherSource: '' });
    setSubmitted(false);
  };

  const error = (v) => (submitted && !v ? <span className="error">Required</span> : null);

  return (
    <div className="container">
      <img
        className="hero"
        src={`${process.env.PUBLIC_URL}/The%20Sound%20Of%20Praise.png`}
        alt="The Sound Of Praise"
      />
      {successMsg && <div className="success">{successMsg}</div>}
      <h1>NEW BIGINNINGS CONCERT</h1>
      <form onSubmit={handleSubmit} noValidate className="form">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Enter your full name" />
          {error(form.name)}
        </div>

        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          {error(form.email)}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="e.g. +254 712 345 678" />
          {error(form.phone)}
        </div>

        <div className="field">
          <label htmlFor="idNumber">ID number</label>
          <input id="idNumber" name="idNumber" type="text" value={form.idNumber} onChange={handleChange} placeholder="Enter your ID number" />
          {error(form.idNumber)}
        </div>

        <div className="field">
          <label htmlFor="excited">What are you excited to start?</label>
          <input id="excited" name="excited" type="text" value={form.excited} onChange={handleChange} placeholder="Your answer" />
          {error(form.excited)}
        </div>

        <div className="field">
          <label htmlFor="source">How did you know about the event?</label>
          <select id="source" name="source" value={form.source} onChange={handleChange}>
            <option value="">Select an option</option>
            <option value="social">Social media handles</option>
            <option value="friends">Friends</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="other">Other</option>
          </select>
          {error(form.source)}
        </div>

        {form.source === 'other' && (
          <div className="field">
            <label htmlFor="otherSource">Please specify</label>
            <input id="otherSource" name="otherSource" type="text" value={form.otherSource} onChange={handleChange} placeholder="Tell us more" />
            {error(form.otherSource)}
          </div>
        )}

        <button type="submit" className="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './Firebase';
import { addDoc, collection } from 'firebase/firestore';

function App() {
  useEffect(() => {
    let isMounted = true;
    
    const testFirestoreConnection = async () => {
      if (!isMounted) return;
      
      try {
        console.log('Testing Firestore connection...');
        const testCollection = collection(db, 'connection_test');
        const testData = {
          timestamp: new Date().toISOString(),
          message: 'Testing Firestore connection',
          success: true
        };
        
        const testDoc = await addDoc(testCollection, testData);
        if (isMounted) {
          console.log('Firestore connection successful! Test document ID:', testDoc.id);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Firestore connection error:', {
            code: error.code,
            message: error.message,
            name: error.name
          });
        }
      }
    };

    testFirestoreConnection();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Form state
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (emailData) => {
    try {
      // EmailJS configuration
      const serviceId = 'service_g0b30zo'; // Your EmailJS service ID
      const templateId = 'template_jc3cvio'; // Your template ID from EmailJS
      
      // Prepare template parameters - ensure these match your EmailJS template
      const templateParams = {
        to_email: emailData.to_email || 'recipient@example.com',
        to_name: emailData.to_name || 'Guest',
        event_name: emailData.event_name || 'New Beginnings Concert',
        event_date: emailData.event_date || 'Sunday 28th September 2025',
        event_time: emailData.event_time || '2:00 pm - 5:00 pm',
        event_venue: emailData.event_venue || 'UON Main Campus',
        contact_phone: emailData.contact_phone || '+254111872056',
        contact_email: emailData.contact_email || 'Re.fous@gmail.com',
        from_name: 'New Biginnings Team',
        reply_to: 'nyamwayagerald@gmail.com'
      };
      
      console.log('Sending email with params:', templateParams);
      
      // Check if EmailJS is loaded
      if (typeof window.emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Make sure the EmailJS SDK is included in your HTML.');
        return false;
      }
      
      // Send email using EmailJS v4
      const response = await window.emailjs.send(
        serviceId,
        templateId,
        templateParams
      );
      
      console.log('Email sent successfully!', response);
      return true;
      
    } catch (error) {
      console.error('Failed to send email:', {
        status: error.status,
        text: error.text,
        message: error.message,
        details: error
      });
      return false;
    }
  };

  const showToast = (message, isError = false) => {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Submitting your registration...');

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'idNumber', 'excited', 'source'];
    const missingFields = requiredFields.filter(field => !form[field]?.trim());
    
    // Additional validation for 'other' source
    if (form.source === 'other' && !form.otherSource?.trim()) {
      missingFields.push('otherSource');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      showToast('Please enter a valid email address', true);
      setSubmitted(false);
      return;
    }

    if (missingFields.length > 0) {
      showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, true);
      setSubmitted(false);
      return;
    }

    // Prepare registration data
    const registrationData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      idNumber: form.idNumber.trim(),
      excited: form.excited.trim(),
      source: form.source === 'other' ? form.otherSource.trim() : form.source,
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, 'registrations'), registrationData);
      console.log('Registration saved with ID: ', docRef.id);
      
      // 2. Prepare email data
      const emailData = {
        to_email: registrationData.email,
        to_name: registrationData.name,
        event_name: 'New Beginnings Concert',
        event_date: 'Sunday 28th September 2025',
        event_time: '2:00 pm - 5:00 pm',
        event_venue: 'UON Main Campus',
        contact_phone: '+254111872056',
        contact_email: 'Re.fous@gmail.com'
      };

      // 3. Send email in the background
      sendEmail(emailData)
        .then(success => {
          if (success) {
            console.log('Confirmation email sent successfully');
          } else {
            console.warn('Failed to send confirmation email');
          }
        })
        .catch(error => {
          console.error('Email sending error:', error);
        });

      // 4. Show success message
      showToast('Registration successful!');
      
      // 5. Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        idNumber: '',
        excited: '',
        source: '',
        otherSource: ''
      });
      
    } catch (error) {
      console.error('Registration error:', {
        code: error.code,
        message: error.message,
        details: error
      });
      showToast('Failed to save registration. Please try again.', true);
    } finally {
      setSubmitted(false);
    }
  };

  const error = (v) => (submitted && !v ? <span className="error">Required</span> : null);

  return (
    <div className="container">
      <img
        className="hero"
        src={`${process.env.PUBLIC_URL}/The%20Sound%20Of%20Praise.png`}
        alt="The Sound Of Praise"
      />
      <h1>NEW BIG-INNINGS CONCERT</h1>
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
          <label htmlFor="excited">What are you excited to start as a new big-inning?</label>
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
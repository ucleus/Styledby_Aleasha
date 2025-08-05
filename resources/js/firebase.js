import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getMessaging, getToken } from 'firebase/messaging';

// Check if Firebase config is available
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase config
const isFirebaseConfigured = firebaseConfig.apiKey && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('placeholder');

let app = null;
let auth = null;
let messaging = null;

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        try {
            messaging = getMessaging(app);
        } catch (error) {
            console.warn('Firebase messaging not supported:', error);
        }
        messaging = getMessaging(app);
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization failed:', error);
    }
} else {
    console.warn('Firebase configuration not found or incomplete. Using development mode.');
}

export { app, auth, messaging, isFirebaseConfigured };
export const requestNotificationPermission = async (swRegistration) => {
    if (!messaging) return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            return await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: swRegistration,
            });
        }
    } catch (error) {
        console.error('Unable to get notification permission or token:', error);
    }

    return null;
};

export { app, auth, isFirebaseConfigured, messaging };
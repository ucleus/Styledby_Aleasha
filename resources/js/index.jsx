import './bootstrap';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

const container = document.getElementById('root');
const root = createRoot(container);

function Main() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(`${import.meta.env.BASE_URL}firebase-messaging-sw.js`);
        }

        if (messaging) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY }).catch(console.error);
                }
            });
        }
    }, []);

    return (
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    );
}

root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
);

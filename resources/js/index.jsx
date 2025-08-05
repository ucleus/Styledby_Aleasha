import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './app';
import { auth, isFirebaseConfigured, requestNotificationPermission } from './firebase';
import { apiCall } from './utils/api';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

if (isFirebaseConfigured && 'serviceWorker' in navigator) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then(async (registration) => {
                    const token = await requestNotificationPermission(registration);
                    if (token) {
                        try {
                            await apiCall('/api/device-tokens', {
                                method: 'POST',
                                body: JSON.stringify({
                                    firebase_uid: user.uid,
                                    token,
                                    platform: 'web',
                                }),
                            });
                        } catch (error) {
                            console.error('Failed to store device token', error);
                        }
                    }
                })
                .catch((error) => console.error('Service worker registration failed', error));
        }
    });
}

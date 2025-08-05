import './bootstrap';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import Snackbar from './components/Snackbar';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import BookingPageTest from './pages/BookingPageTest';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (!messaging) return;
        const unsubscribe = onMessage(messaging, (payload) => {
            const body = payload?.notification?.body || 'You have a new notification';
            setAlert(body);
        });
        return unsubscribe;
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="booking" element={<BookingPage />} />
                    <Route path="booking-test" element={<BookingPageTest />} />
                    <Route path="payment" element={<PaymentPage />} />
                    <Route path="login" element={<LoginPage />} />
                </Route>
                {/* Admin routes - separate from main layout */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
            <Snackbar message={alert} onClose={() => setAlert(null)} />
        </>
    );
}

export default App;

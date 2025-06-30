import './bootstrap';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
    return (
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
    );
}

export default App;
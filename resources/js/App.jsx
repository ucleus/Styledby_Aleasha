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
            <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;
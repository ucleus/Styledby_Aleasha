import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';

const PaymentPage = () => {
    const location = useLocation();
    const [selectedPaymentOption, setSelectedPaymentOption] = useState('deposit');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardName: ''
    });

    // Get booking data from navigation state or use fallback
    const bookingData = location.state?.bookingData || {
        service: { name: "Women's Cut & Style", price: 85, duration: 60 },
        date: "Friday, June 20, 2025",
        time: "10:00 AM",
        customerInfo: { name: "Jane Doe", email: "jane@example.com", phone: "(555) 123-4567" }
    };

    const depositAmount = Math.round(bookingData.service.price * 0.5);
    const fullAmount = bookingData.service.price;

    const handleCardInputChange = (field, value) => {
        setCardDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handlePayment = () => {
        const paymentAmount = selectedPaymentOption === 'deposit' ? depositAmount : fullAmount;
        console.log('Processing payment:', {
            amount: paymentAmount,
            booking: bookingData,
            cardDetails: cardDetails
        });
        alert(`Processing $${paymentAmount} payment...`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Secure Your Appointment</h1>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Booking Summary */}
                        <Card className="p-4 sm:p-6 h-fit">
                            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                            <div className="space-y-3 text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service:</span>
                                    <span className="font-medium">{bookingData.service.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span>{bookingData.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span>{bookingData.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span>{bookingData.service.duration} minutes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Customer:</span>
                                    <span>{bookingData.customerInfo.name}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total Service Price:</span>
                                        <span>${bookingData.service.price}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Payment Options */}
                        <Card className="p-4 sm:p-6">
                            <h2 className="text-xl font-bold mb-4">Payment Options</h2>
                            
                            {/* Payment Amount Selection */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Choose Payment Amount</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentOption"
                                            value="deposit"
                                            checked={selectedPaymentOption === 'deposit'}
                                            onChange={(e) => setSelectedPaymentOption(e.target.value)}
                                            className="mr-3 text-purple-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">50% Deposit</span>
                                                <span className="text-xl font-bold text-purple-600">${depositAmount}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Pay remaining ${fullAmount - depositAmount} at appointment</p>
                                        </div>
                                    </label>
                                    
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentOption"
                                            value="full"
                                            checked={selectedPaymentOption === 'full'}
                                            onChange={(e) => setSelectedPaymentOption(e.target.value)}
                                            className="mr-3 text-purple-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Full Payment</span>
                                                <span className="text-xl font-bold text-green-600">${fullAmount}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Pay in full now</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Card Details Form */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Payment Information</h3>
                                <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                                            <input
                                                type="text"
                                                value={cardDetails.cardName}
                                                onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                                                placeholder="Name on card"
                                                className="w-full p-3 border rounded-lg text-sm sm:text-base"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                value={cardDetails.cardNumber}
                                                onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                className="w-full p-3 border rounded-lg text-sm sm:text-base font-mono"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Month</label>
                                                <select
                                                    value={cardDetails.expiryMonth}
                                                    onChange={(e) => handleCardInputChange('expiryMonth', e.target.value)}
                                                    className="w-full p-3 border rounded-lg text-sm sm:text-base"
                                                >
                                                    <option value="">MM</option>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                            {String(i + 1).padStart(2, '0')}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Year</label>
                                                <select
                                                    value={cardDetails.expiryYear}
                                                    onChange={(e) => handleCardInputChange('expiryYear', e.target.value)}
                                                    className="w-full p-3 border rounded-lg text-sm sm:text-base"
                                                >
                                                    <option value="">YY</option>
                                                    {Array.from({ length: 20 }, (_, i) => {
                                                        const year = new Date().getFullYear() + i;
                                                        return (
                                                            <option key={year} value={year.toString().slice(-2)}>
                                                                {year.toString().slice(-2)}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">CVV</label>
                                                <input
                                                    type="text"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                    placeholder="123"
                                                    maxLength="4"
                                                    className="w-full p-3 border rounded-lg text-sm sm:text-base font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            {/* Payment Summary & Button */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Amount to Pay:</span>
                                    <span className="text-2xl font-bold text-purple-600">
                                        ${selectedPaymentOption === 'deposit' ? depositAmount : fullAmount}
                                    </span>
                                </div>
                                
                                <button
                                    onClick={handlePayment}
                                    disabled={!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Complete Payment
                                </button>
                                
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    🔒 Your payment information is secure and encrypted
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
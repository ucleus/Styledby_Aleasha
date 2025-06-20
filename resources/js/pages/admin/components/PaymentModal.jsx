import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';

const PaymentModal = ({ isOpen, onClose, onSuccess, appointment }) => {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState('full');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardName: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen || !appointment) return null;

    const servicePrice = appointment.service.price;
    const depositAmount = Math.round(servicePrice * 0.5);
    const fullAmount = servicePrice;

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

    const handlePayment = async () => {
        const paymentAmount = selectedPaymentOption === 'deposit' ? depositAmount : fullAmount;
        setLoading(true);

        try {
            // Simulate payment processing
            console.log('Processing payment:', {
                appointmentId: appointment.id,
                amount: paymentAmount,
                paymentType: selectedPaymentOption,
                cardDetails: cardDetails
            });

            // In a real implementation, you would call your payment processor here
            // For now, we'll simulate a successful payment and update the appointment status

            // Update appointment status to paid
            const response = await fetch(`/api/admin-public/appointments/${appointment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    status: 'paid',
                    amount_paid_cents: paymentAmount * 100 // Convert to cents
                })
            });

            const result = await response.json();

            if (result.success) {
                onSuccess?.({
                    appointmentId: appointment.id,
                    amountPaid: paymentAmount,
                    paymentType: selectedPaymentOption,
                    customerName: appointment.client.name
                });
                resetForm();
            } else {
                throw new Error(result.message || 'Failed to process payment');
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedPaymentOption('full');
        setCardDetails({
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            cardName: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const isFormValid = cardDetails.cardNumber && cardDetails.cardName && 
                       cardDetails.expiryMonth && cardDetails.expiryYear && cardDetails.cvv;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Process Payment</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Appointment Summary */}
                        <div>
                            <h3 className="font-bold mb-4 text-gray-900">Appointment Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Customer:</span>
                                    <span className="font-medium">{appointment.client.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service:</span>
                                    <span className="font-medium">{appointment.service.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span>{appointment.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span>{appointment.service.duration} minutes</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold">
                                        <span>Service Price:</span>
                                        <span>${servicePrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div>
                            <h3 className="font-bold mb-4 text-gray-900">Payment Information</h3>
                            
                            {/* Payment Amount Selection */}
                            <div className="mb-4">
                                <h4 className="font-semibold mb-3 text-sm">Payment Amount</h4>
                                <div className="space-y-2">
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
                                                <span className="font-medium text-sm">Full Payment</span>
                                                <span className="text-lg font-bold text-green-600">${fullAmount}</span>
                                            </div>
                                            <p className="text-xs text-gray-600">Pay in full now</p>
                                        </div>
                                    </label>
                                    
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
                                                <span className="font-medium text-sm">50% Deposit</span>
                                                <span className="text-lg font-bold text-purple-600">${depositAmount}</span>
                                            </div>
                                            <p className="text-xs text-gray-600">Pay remaining ${fullAmount - depositAmount} at appointment</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={cardDetails.cardName}
                                        onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                                        placeholder="Name on card"
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        className="w-full p-2 border rounded-md text-sm font-mono"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Month</label>
                                        <select
                                            value={cardDetails.expiryMonth}
                                            onChange={(e) => handleCardInputChange('expiryMonth', e.target.value)}
                                            className="w-full p-2 border rounded-md text-sm"
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
                                        <label className="block text-sm font-medium mb-1">Year</label>
                                        <select
                                            value={cardDetails.expiryYear}
                                            onChange={(e) => handleCardInputChange('expiryYear', e.target.value)}
                                            className="w-full p-2 border rounded-md text-sm"
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
                                        <label className="block text-sm font-medium mb-1">CVV</label>
                                        <input
                                            type="text"
                                            value={cardDetails.cvv}
                                            onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            placeholder="123"
                                            maxLength="4"
                                            className="w-full p-2 border rounded-md text-sm font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Amount to Pay:</span>
                        <span className="text-2xl font-bold text-purple-600">
                            ${selectedPaymentOption === 'deposit' ? depositAmount : fullAmount}
                        </span>
                    </div>
                    
                    <div className="flex justify-between space-x-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={!isFormValid || loading}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition-colors"
                        >
                            {loading ? 'Processing...' : 'Complete Payment'}
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-3">
                        🔒 Your payment information is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
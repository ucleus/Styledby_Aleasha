import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import CalendarBooking from '../components/CalendarBooking';

const BookingPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        service: null,
        date: null,
        time: null,
        customerInfo: {
            name: '',
            email: '',
            phone: '',
            notes: ''
        }
    });

    const services = [
        {
            id: 1,
            name: 'Women\'s Cut & Style',
            description: 'Includes consultation, shampoo, precision cut, and style.',
            duration: 60,
            price: 85,
        },
        {
            id: 2,
            name: 'Men\'s Cut & Style', 
            description: 'Includes consultation, shampoo, precision cut, and style.',
            duration: 45,
            price: 45,
        },
        {
            id: 3,
            name: 'Color Service',
            description: 'Full color, balayage, highlights, or color correction.',
            duration: 120,
            price: 120,
        },
        {
            id: 4,
            name: 'Blowout & Style',
            description: 'Shampoo, blow dry, and styling for any occasion.',
            duration: 45,
            price: 55,
        },
        {
            id: 5,
            name: 'Formal/Updo Styling',
            description: 'Special occasion styling for weddings, proms, and events.',
            duration: 60,
            price: 85,
        },
        {
            id: 6,
            name: 'Deep Conditioning Treatment',
            description: 'Intensive repair and hydration for damaged hair.',
            duration: 30,
            price: 35,
        },
    ];

    const selectService = (service) => {
        setBookingData({ ...bookingData, service });
        setCurrentStep(2);
    };

    const selectDateTime = (date, time) => {
        setBookingData({ ...bookingData, date, time });
        setCurrentStep(3);
    };

    const updateCustomerInfo = (field, value) => {
        setBookingData({
            ...bookingData,
            customerInfo: { ...bookingData.customerInfo, [field]: value }
        });
    };

    const handleBookingSubmit = () => {
        console.log('Booking submitted:', bookingData);
        setCurrentStep(4);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Book Your Appointment</h1>
                
                {/* Progress Steps */}
                <div className="max-w-4xl mx-auto mb-6 md:mb-8">
                    <div className="flex justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className={`flex items-center flex-shrink-0 ${step <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
                                <button
                                    onClick={() => {
                                        // Only allow going back to completed steps
                                        if (step < currentStep || (step === currentStep && step !== 4)) {
                                            setCurrentStep(step);
                                        }
                                    }}
                                    disabled={step > currentStep}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base ${
                                        step <= currentStep 
                                            ? 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer' 
                                            : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    {step}
                                </button>
                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm hidden xs:block">
                                    {step === 1 && 'Service'}
                                    {step === 2 && 'Date/Time'}
                                    {step === 3 && 'Details'}
                                    {step === 4 && 'Done'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Step 1: Service Selection */}
                    {currentStep === 1 && (
                        <Card className="p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select Your Service</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => selectService(service)}
                                        className="p-3 sm:p-4 border rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors active:bg-purple-100"
                                    >
                                        <h3 className="font-semibold text-base sm:text-lg">{service.name}</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{service.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-xs sm:text-sm">{service.duration} min</span>
                                            <span className="font-bold text-purple-600 text-sm sm:text-base">${service.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Step 2: Date & Time Selection */}
                    {currentStep === 2 && (
                        <Card className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Choose Date & Time</h2>
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base self-start"
                                >
                                    ← Change Service
                                </button>
                            </div>
                            <div className="mb-4 sm:mb-6">
                                <p className="text-gray-600 text-sm sm:text-base">Selected: <span className="font-semibold">{bookingData.service?.name}</span></p>
                                <p className="text-xs sm:text-sm text-gray-500">Duration: {bookingData.service?.duration} minutes</p>
                            </div>
                            
                            <CalendarBooking 
                                selectedService={bookingData.service}
                                onDateTimeSelect={selectDateTime}
                            />
                        </Card>
                    )}

                    {/* Step 3: Customer Information */}
                    {currentStep === 3 && (
                        <Card className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Your Information</h2>
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base self-start"
                                >
                                    ← Change Date/Time
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={bookingData.customerInfo.name}
                                        onChange={(e) => updateCustomerInfo('name', e.target.value)}
                                        className="w-full p-3 border rounded-lg text-sm sm:text-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={bookingData.customerInfo.email}
                                        onChange={(e) => updateCustomerInfo('email', e.target.value)}
                                        className="w-full p-3 border rounded-lg text-sm sm:text-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={bookingData.customerInfo.phone}
                                        onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                                        className="w-full p-3 border rounded-lg text-sm sm:text-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                                    <textarea
                                        value={bookingData.customerInfo.notes}
                                        onChange={(e) => updateCustomerInfo('notes', e.target.value)}
                                        className="w-full p-3 border rounded-lg h-20 sm:h-24 text-sm sm:text-base resize-none"
                                        placeholder="Any special requests or notes..."
                                    />
                                </div>
                                
                                {/* Booking Summary */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mt-4 sm:mt-6">
                                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Booking Summary</h3>
                                    <div className="space-y-1 text-xs sm:text-sm">
                                        <div className="flex justify-between">
                                            <span>Service:</span>
                                            <span className="text-right">{bookingData.service?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span>{bookingData.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Time:</span>
                                            <span>{bookingData.time}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Duration:</span>
                                            <span>{bookingData.service?.duration} minutes</span>
                                        </div>
                                        <div className="flex justify-between font-semibold border-t pt-2 text-sm sm:text-base">
                                            <span>Total:</span>
                                            <span>${bookingData.service?.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookingSubmit}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </Card>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                        <Card className="p-4 sm:p-6 text-center">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setCurrentStep(3)}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm"
                                >
                                    ← Edit Booking
                                </button>
                            </div>
                            <div className="text-green-600 mb-4">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Booking Confirmed!</h2>
                            <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                Thank you for booking with Styles by Aleasha. We've sent a confirmation email with all the details.
                            </p>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-6 text-left">
                                <h3 className="font-semibold mb-2 text-sm sm:text-base text-center">Your Appointment</h3>
                                <div className="space-y-1 text-xs sm:text-sm">
                                    <div className="flex justify-between">
                                        <span>Service:</span>
                                        <span className="text-right">{bookingData.service?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{bookingData.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Time:</span>
                                        <span>{bookingData.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duration:</span>
                                        <span>{bookingData.service?.duration} minutes</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        console.log('Navigating to payment with:', bookingData);
                                        navigate('/payment', { state: { bookingData } });
                                    }}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Secure Appointment
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentStep(1);
                                        setBookingData({
                                            service: null,
                                            date: null,
                                            time: null,
                                            customerInfo: { name: '', email: '', phone: '', notes: '' }
                                        });
                                    }}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Book Another Appointment
                                </button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
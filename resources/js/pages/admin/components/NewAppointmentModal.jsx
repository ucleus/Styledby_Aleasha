import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';

const NewAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        // Customer Info
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        // Appointment Details
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
        // Payment
        paymentStatus: 'booked' // booked, paid, completed, canceled
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load services when modal opens
    useEffect(() => {
        if (isOpen) {
            loadServices();
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setFormData(prev => ({
                ...prev,
                appointmentDate: tomorrow.toISOString().split('T')[0]
            }));
        }
    }, [isOpen]);

    const loadServices = async () => {
        try {
            const response = await fetch('/api/admin-public/services');
            const data = await response.json();
            if (data.success) {
                setServices(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load services:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
            if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Invalid email format';
            if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
        }

        if (step === 2) {
            if (!formData.serviceId) newErrors.serviceId = 'Please select a service';
            if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
            if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const createAppointment = async () => {
        if (!validateStep(2)) return;

        setLoading(true);
        try {
            // Find selected service
            const selectedService = services.find(s => s.id == formData.serviceId);
            if (!selectedService) {
                throw new Error('Selected service not found');
            }

            // Calculate appointment end time
            const startDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
            const endDateTime = new Date(startDateTime.getTime() + (selectedService.duration_min * 60000));

            const appointmentData = {
                // Customer data
                customer: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    phone: formData.customerPhone
                },
                // Appointment data
                service_type_id: parseInt(formData.serviceId),
                start_at: startDateTime.toISOString(),
                end_at: endDateTime.toISOString(),
                status: formData.paymentStatus,
                notes: formData.notes,
                amount_paid_cents: formData.paymentStatus === 'paid' ? selectedService.price_cents : 0
            };

            console.log('Creating appointment:', appointmentData);

            const response = await fetch('/api/admin-public/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            const result = await response.json();

            if (result.success) {
                onSuccess?.(result.data);
                resetForm();
                onClose();
            } else {
                throw new Error(result.message || 'Failed to create appointment');
            }
        } catch (error) {
            console.error('Failed to create appointment:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setFormData({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            serviceId: '',
            appointmentDate: '',
            appointmentTime: '',
            notes: '',
            paymentStatus: 'booked'
        });
        setErrors({});
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        return slots;
    };

    console.log('Modal render - isOpen:', isOpen);
    if (!isOpen) return null;

    const selectedService = services.find(s => s.id == formData.serviceId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Create New Appointment</h2>
                        <button
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="mt-4 flex items-center space-x-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {step}
                                </div>
                                <span className="ml-2 text-sm">
                                    {step === 1 && 'Customer'}
                                    {step === 2 && 'Service & Time'}
                                    {step === 3 && 'Review'}
                                </span>
                                {step < 3 && <div className="ml-4 w-8 h-0.5 bg-gray-200"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Customer Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                        errors.customerName ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Enter customer's full name"
                                />
                                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                        errors.customerEmail ? 'border-red-500' : ''
                                    }`}
                                    placeholder="customer@example.com"
                                />
                                {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                        errors.customerPhone ? 'border-red-500' : ''
                                    }`}
                                    placeholder="(555) 123-4567"
                                />
                                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Service & Time */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Service & Appointment Time</h3>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Service *</label>
                                <select
                                    value={formData.serviceId}
                                    onChange={(e) => handleInputChange('serviceId', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                        errors.serviceId ? 'border-red-500' : ''
                                    }`}
                                >
                                    <option value="">Choose a service...</option>
                                    {services.map(service => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} - ${(service.price_cents / 100).toFixed(2)} ({service.duration_min} min)
                                        </option>
                                    ))}
                                </select>
                                {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date *</label>
                                    <input
                                        type="date"
                                        value={formData.appointmentDate}
                                        onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                            errors.appointmentDate ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.appointmentDate && <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Time *</label>
                                    <select
                                        value={formData.appointmentTime}
                                        onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                            errors.appointmentTime ? 'border-red-500' : ''
                                        }`}
                                    >
                                        <option value="">Select time...</option>
                                        {generateTimeSlots().map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    {errors.appointmentTime && <p className="text-red-500 text-sm mt-1">{errors.appointmentTime}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Status</label>
                                <select
                                    value={formData.paymentStatus}
                                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="booked">Booked (No payment)</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-20 resize-none"
                                    placeholder="Any special requests or notes..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Review Appointment</h3>
                            
                            <Card className="p-4 bg-gray-50">
                                <div className="space-y-3">
                                    <div><strong>Customer:</strong> {formData.customerName}</div>
                                    <div><strong>Email:</strong> {formData.customerEmail}</div>
                                    <div><strong>Phone:</strong> {formData.customerPhone}</div>
                                    <hr />
                                    <div><strong>Service:</strong> {selectedService?.name}</div>
                                    <div><strong>Duration:</strong> {selectedService?.duration_min} minutes</div>
                                    <div><strong>Price:</strong> ${(selectedService?.price_cents / 100 || 0).toFixed(2)}</div>
                                    <div><strong>Date:</strong> {new Date(formData.appointmentDate).toLocaleDateString()}</div>
                                    <div><strong>Time:</strong> {formData.appointmentTime}</div>
                                    <div><strong>Status:</strong> {formData.paymentStatus}</div>
                                    {formData.notes && <div><strong>Notes:</strong> {formData.notes}</div>}
                                </div>
                            </Card>

                            {errors.submit && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600 text-sm">{errors.submit}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex justify-between">
                    <button
                        onClick={currentStep === 1 ? () => { resetForm(); onClose(); } : prevStep}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        {currentStep === 1 ? 'Cancel' : '← Back'}
                    </button>

                    <div className="space-x-3">
                        {currentStep < 3 ? (
                            <button
                                onClick={nextStep}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={createAppointment}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Appointment'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewAppointmentModal;
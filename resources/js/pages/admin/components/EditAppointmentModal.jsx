import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';

const EditAppointmentModal = ({ isOpen, onClose, onSuccess, appointment }) => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
        paymentStatus: 'booked'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load services and populate form when modal opens
    useEffect(() => {
        if (isOpen && appointment) {
            loadServices();
            setFormData({
                customerName: appointment.client.name,
                customerEmail: appointment.client.email,
                customerPhone: appointment.client.phone,
                serviceId: appointment.service.id || '',
                appointmentDate: appointment.date,
                appointmentTime: appointment.time,
                notes: appointment.notes || '',
                paymentStatus: appointment.status
            });
        }
    }, [isOpen, appointment]);

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
        if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Invalid email format';
        if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
        if (!formData.serviceId) newErrors.serviceId = 'Please select a service';
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
        if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateAppointment = async () => {
        if (!validateForm()) return;

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

            console.log('Updating appointment:', appointmentData);

            const response = await fetch(`/api/admin-public/appointments/${appointment.id}`, {
                method: 'PUT',
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
                throw new Error(result.message || 'Failed to update appointment');
            }
        } catch (error) {
            console.error('Failed to update appointment:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
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

    if (!isOpen || !appointment) return null;

    const selectedService = services.find(s => s.id == formData.serviceId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Edit Appointment</h2>
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
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="md:col-span-2">
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
                        </div>
                    </div>

                    {/* Service & Time */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Service & Appointment Time</h3>
                        <div className="space-y-4">
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
                                <label className="block text-sm font-medium mb-2">Appointment Status</label>
                                <select
                                    value={formData.paymentStatus}
                                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="booked">Booked (No payment)</option>
                                    <option value="paid">Paid</option>
                                    <option value="completed">Completed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                                {formData.paymentStatus === 'canceled' && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        You can change this back to "Booked" or "Paid" to reactivate the appointment.
                                    </p>
                                )}
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
                    </div>

                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{errors.submit}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex justify-between">
                    <button
                        onClick={() => { resetForm(); onClose(); }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={updateAppointment}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        {loading ? 'Updating...' : 'Update Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAppointmentModal;
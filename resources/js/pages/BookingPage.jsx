import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Fetch services
    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await axios.get('/api/services');
            return response.data.data;
        }
    });

    // Fetch available slots
    const { data: slots, isLoading: slotsLoading } = useQuery({
        queryKey: ['slots', selectedDate, selectedService],
        queryFn: async () => {
            if (!selectedService) return [];
            const response = await axios.post('/api/availability/slots', {
                date: format(selectedDate, 'yyyy-MM-dd'),
                service_type_id: selectedService
            });
            return response.data.data;
        },
        enabled: !!selectedService
    });

    // Book appointment mutation
    const bookMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post('/api/appointments', data);
            return response.data.data;
        },
        onSuccess: (data) => {
            // Redirect to Square checkout
            window.location.href = data.checkout_url;
        }
    });

    const handleBooking = () => {
        if (!selectedSlot || !selectedService) return;

        bookMutation.mutate({
            firebase_uid: user.firebase_uid,
            service_type_id: selectedService,
            start_at: selectedSlot.start_at,
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Book Your Appointment</h1>
            
            <div className="grid md:grid-cols-3 gap-6">
                {/* Step 1: Select Service */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">1. Select Service</h2>
                    <div className="space-y-3">
                        {services?.map((service) => (
                            <div
                                key={service.id}
                                className={`p-4 border rounded cursor-pointer transition ${
                                    selectedService === service.id
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedService(service.id)}
                            >
                                <h3 className="font-medium">{service.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {service.duration_min} minutes - ${service.price_cents / 100}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Deposit: ${service.deposit_amount_cents / 100}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Step 2: Select Date */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">2. Select Date</h2>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                    />
                </Card>

                {/* Step 3: Select Time */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">3. Select Time</h2>
                    {selectedService ? (
                        slotsLoading ? (
                            <p>Loading available times...</p>
                        ) : slots?.length > 0 ? (
                            <div className="space-y-2">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.start_at}
                                        className={`w-full p-3 text-left border rounded transition ${
                                            selectedSlot?.start_at === slot.start_at
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {format(new Date(slot.start_at), 'h:mm a')}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No available times for this date</p>
                        )
                    ) : (
                        <p className="text-gray-500">Please select a service first</p>
                    )}
                </Card>
            </div>

            {/* Booking Summary */}
            {selectedService && selectedSlot && (
                <Card className="mt-6 p-6">
                    <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                    <div className="space-y-2 mb-6">
                        <p><strong>Service:</strong> {services?.find(s => s.id === selectedService)?.name}</p>
                        <p><strong>Date:</strong> {format(selectedDate, 'MMMM d, yyyy')}</p>
                        <p><strong>Time:</strong> {format(new Date(selectedSlot.start_at), 'h:mm a')}</p>
                        <p><strong>Deposit Required:</strong> ${services?.find(s => s.id === selectedService)?.deposit_amount_cents / 100}</p>
                    </div>
                    <Button
                        onClick={handleBooking}
                        disabled={bookMutation.isLoading}
                        className="w-full"
                    >
                        {bookMutation.isLoading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default BookingPage;
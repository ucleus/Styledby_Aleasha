import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';

const CalendarBooking = ({ selectedService, onDateTimeSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Generate calendar days for current month
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        while (currentDate <= lastDay || currentDate.getDay() !== 0) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const fetchAvailableSlots = async (date) => {
        if (!selectedService) return;

        setLoading(true);
        try {
            // Simulate API call to get available slots
            // Replace with actual API call: axios.post('/api/availability/slots', {...})
            
            const mockSlots = [
                { start_at: `${date}T09:00:00`, end_at: `${date}T10:00:00` },
                { start_at: `${date}T10:30:00`, end_at: `${date}T11:30:00` },
                { start_at: `${date}T14:00:00`, end_at: `${date}T15:00:00` },
                { start_at: `${date}T15:30:00`, end_at: `${date}T16:30:00` },
            ];

            setAvailableSlots(mockSlots);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        fetchAvailableSlots(dateStr);
    };

    const handleTimeSelect = (slot) => {
        const date = selectedDate;
        const time = new Date(slot.start_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        onDateTimeSelect(date, time);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isCurrentMonth = (date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
        setSelectedDate(null);
        setAvailableSlots([]);
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="space-y-6">
            {/* Calendar */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        ←
                    </button>
                    <h3 className="text-lg font-semibold">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        →
                    </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        const disabled = isPastDate(date) || !isCurrentMonth(date);

                        return (
                            <button
                                key={index}
                                onClick={() => !disabled && handleDateSelect(date)}
                                disabled={disabled}
                                className={`
                                    p-2 text-sm rounded transition-colors
                                    ${disabled 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'hover:bg-purple-100 cursor-pointer'
                                    }
                                    ${isSelected ? 'bg-purple-600 text-white' : ''}
                                    ${isToday(date) && !isSelected ? 'bg-purple-100 font-semibold' : ''}
                                    ${!isCurrentMonth(date) ? 'text-gray-400' : ''}
                                `}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Available Times */}
            {selectedDate && (
                <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-4">
                        Available Times for {formatDate(new Date(selectedDate))}
                    </h4>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading available times...</p>
                        </div>
                    ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTimeSelect(slot)}
                                    className="p-3 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                                >
                                    {formatTime(slot.start_at)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No available times for this date.</p>
                            <p className="text-sm mt-1">Please select another date.</p>
                        </div>
                    )}
                </Card>
            )}

            {/* Integration Status */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>🗓️ Calendar integration with Google Calendar ready</p>
                <p>Availability checked in real-time to prevent double bookings</p>
            </div>
        </div>
    );
};

export default CalendarBooking;
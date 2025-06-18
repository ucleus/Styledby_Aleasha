import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';

const AdminAvailability = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [blockedDates, setBlockedDates] = useState([
        '2025-06-20', '2025-06-25', '2025-07-04' // Example blocked dates
    ]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [blockType, setBlockType] = useState('full-day'); // 'full-day' or 'partial'
    const [timeSlots, setTimeSlots] = useState({
        start: '09:00',
        end: '17:00'
    });

    // Generate calendar days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const isDateBlocked = (date) => {
        if (!date) return false;
        return blockedDates.includes(formatDate(date));
    };

    const isPastDate = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const toggleDateBlock = (date) => {
        if (!date || isPastDate(date)) return;
        
        const dateStr = formatDate(date);
        setBlockedDates(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr);
            } else {
                return [...prev, dateStr];
            }
        });
    };

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const saveBlockedDates = () => {
        // TODO: Send blocked dates to backend
        console.log('Saving blocked dates:', blockedDates);
        alert('Blocked dates saved successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Calendar Management</h2>
                <button
                    onClick={saveBlockedDates}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Save Changes
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map(day => (
                                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth(currentMonth).map((date, index) => (
                                <button
                                    key={index}
                                    onClick={() => date && toggleDateBlock(date)}
                                    disabled={!date || isPastDate(date)}
                                    className={`
                                        aspect-square p-2 text-sm rounded-lg transition-colors
                                        ${!date ? 'invisible' : ''}
                                        ${isPastDate(date) 
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'hover:bg-gray-100 cursor-pointer'
                                        }
                                        ${isDateBlocked(date) 
                                            ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                                            : 'bg-white border border-gray-200'
                                        }
                                        ${selectedDate === date 
                                            ? 'ring-2 ring-purple-500' 
                                            : ''
                                        }
                                    `}
                                >
                                    {date ? date.getDate() : ''}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                                    <span>Blocked dates</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                    <span>Past dates</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                Block entire weekend
                            </button>
                            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                Block holiday period
                            </button>
                            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                Clear all blocks this month
                            </button>
                        </div>
                    </Card>

                    {/* Business Hours */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4">Default Business Hours</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Opening Time</label>
                                <input
                                    type="time"
                                    value={timeSlots.start}
                                    onChange={(e) => setTimeSlots(prev => ({ ...prev, start: e.target.value }))}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Closing Time</label>
                                <input
                                    type="time"
                                    value={timeSlots.end}
                                    onChange={(e) => setTimeSlots(prev => ({ ...prev, end: e.target.value }))}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors">
                                Update Hours
                            </button>
                        </div>
                    </Card>

                    {/* Blocked Dates Summary */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4">Blocked Dates</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {blockedDates.length === 0 ? (
                                <p className="text-gray-500 text-sm">No blocked dates</p>
                            ) : (
                                blockedDates.map(date => (
                                    <div key={date} className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-md">
                                        <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => toggleDateBlock(new Date(date))}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminAvailability;
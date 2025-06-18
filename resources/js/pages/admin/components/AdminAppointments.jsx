import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';

const AdminAppointments = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Mock appointments data
    const appointments = [
        {
            id: 1,
            client: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 123-4567' },
            service: { name: "Women's Cut & Style", duration: 60, price: 85 },
            date: '2025-06-20',
            time: '10:00 AM',
            status: 'confirmed',
            paymentStatus: 'paid',
            notes: 'First time client, prefers shorter length'
        },
        {
            id: 2,
            client: { name: 'Mike Davis', email: 'mike@example.com', phone: '(555) 234-5678' },
            service: { name: "Men's Cut & Style", duration: 45, price: 45 },
            date: '2025-06-20',
            time: '2:30 PM',
            status: 'confirmed',
            paymentStatus: 'pending',
            notes: 'Regular client, usual cut'
        },
        {
            id: 3,
            client: { name: 'Emily Carter', email: 'emily@example.com', phone: '(555) 345-6789' },
            service: { name: 'Color Service', duration: 120, price: 120 },
            date: '2025-06-20',
            time: '4:00 PM',
            status: 'pending',
            paymentStatus: 'deposit',
            notes: 'Wants to go from brunette to blonde'
        },
        {
            id: 4,
            client: { name: 'Jessica Brown', email: 'jessica@example.com', phone: '(555) 456-7890' },
            service: { name: 'Blowout & Style', duration: 45, price: 55 },
            date: '2025-06-21',
            time: '11:00 AM',
            status: 'confirmed',
            paymentStatus: 'paid',
            notes: 'Special occasion - anniversary dinner'
        },
    ];

    const filters = [
        { key: 'all', label: 'All Appointments', count: appointments.length },
        { key: 'today', label: 'Today', count: appointments.filter(a => a.date === selectedDate).length },
        { key: 'confirmed', label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length },
        { key: 'pending', label: 'Pending', count: appointments.filter(a => a.status === 'pending').length },
    ];

    const getFilteredAppointments = () => {
        switch (selectedFilter) {
            case 'today':
                return appointments.filter(a => a.date === selectedDate);
            case 'confirmed':
                return appointments.filter(a => a.status === 'confirmed');
            case 'pending':
                return appointments.filter(a => a.status === 'pending');
            default:
                return appointments;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'deposit': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const updateAppointmentStatus = (id, newStatus) => {
        console.log(`Update appointment ${id} to ${newStatus}`);
        // TODO: Update appointment status in backend
    };

    const filteredAppointments = getFilteredAppointments();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
                <div className="flex space-x-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                        New Appointment
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setSelectedFilter(filter.key)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            selectedFilter === filter.key
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {filter.label} ({filter.count})
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">No appointments found for the selected filter.</p>
                    </Card>
                ) : (
                    filteredAppointments.map(appointment => (
                        <Card key={appointment.id} className="p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {appointment.client.name}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                                            {appointment.paymentStatus}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Service</p>
                                            <p className="font-medium">{appointment.service.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {appointment.service.duration} min • ${appointment.service.price}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                            <p className="font-medium">
                                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Contact</p>
                                            <p className="text-sm">{appointment.client.email}</p>
                                            <p className="text-sm">{appointment.client.phone}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Notes</p>
                                            <p className="text-sm text-gray-700">
                                                {appointment.notes || 'No notes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                    {appointment.status === 'pending' && (
                                        <button
                                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                            className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                                        Reschedule
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            ${filteredAppointments.reduce((sum, apt) => sum + apt.service.price, 0)}
                        </p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                </Card>
                
                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {filteredAppointments.reduce((sum, apt) => sum + apt.service.duration, 0)} min
                        </p>
                        <p className="text-sm text-gray-600">Total Duration</p>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
                        </p>
                        <p className="text-sm text-gray-600">Confirmed</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminAppointments;
import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import NewAppointmentModal from './NewAppointmentModal';
import EditAppointmentModal from './EditAppointmentModal';
import PaymentModal from './PaymentModal';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import NotificationModal from '../../../components/ui/NotificationModal';

const AdminAppointments = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
    const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [paymentAppointment, setPaymentAppointment] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
    
    // Modal states
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'default',
        onConfirm: () => {}
    });
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    // Load appointments from API
    const loadAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin-public/appointments');
            const data = await response.json();
            
            if (data.success) {
                // Transform API data to match component structure
                const transformedAppointments = data.data.map(apt => ({
                    id: apt.id,
                    client: {
                        name: apt.customer.name,
                        email: apt.customer.email,
                        phone: apt.customer.phone
                    },
                    service: {
                        name: apt.service.name,
                        duration: apt.service.duration,
                        price: apt.service.price
                    },
                    date: apt.date,
                    time: apt.time,
                    status: apt.status,
                    paymentStatus: apt.status === 'canceled' 
                        ? 'canceled' 
                        : apt.payment_status,
                    notes: apt.notes || 'No notes'
                }));
                setAppointments(transformedAppointments);
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load appointments on component mount
    useEffect(() => {
        loadAppointments();
    }, []);

    // Helper functions for modals
    const showConfirmation = (title, message, type, onConfirm) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            type,
            onConfirm
        });
    };

    const showNotification = (title, message, type = 'success') => {
        setNotificationModal({
            isOpen: true,
            title,
            message,
            type
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const closeNotificationModal = () => {
        setNotificationModal(prev => ({ ...prev, isOpen: false }));
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const selectedDateAppointments = appointments.filter(a => a.date === selectedDate);
    
    const filters = [
        { 
            key: 'all', 
            label: isToday ? 'All Appointments' : `All (${selectedDateAppointments.length} on selected date)`, 
            count: isToday ? appointments.length : selectedDateAppointments.length 
        },
        { key: 'today', label: 'Today', count: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length },
        { 
            key: 'confirmed', 
            label: 'Confirmed', 
            count: isToday ? appointments.filter(a => a.status === 'confirmed' || a.status === 'paid').length : selectedDateAppointments.filter(a => a.status === 'confirmed' || a.status === 'paid').length
        },
        { 
            key: 'pending', 
            label: 'Pending', 
            count: isToday ? appointments.filter(a => a.status === 'pending' || a.status === 'booked').length : selectedDateAppointments.filter(a => a.status === 'pending' || a.status === 'booked').length
        },
        { 
            key: 'canceled', 
            label: 'Canceled', 
            count: isToday ? appointments.filter(a => a.status === 'canceled').length : selectedDateAppointments.filter(a => a.status === 'canceled').length
        },
    ];

    const getFilteredAndSortedAppointments = () => {
        let filtered;
        
        // First, determine base filter
        switch (selectedFilter) {
            case 'today':
                filtered = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
                break;
            case 'confirmed':
                filtered = appointments.filter(a => a.status === 'confirmed' || a.status === 'paid');
                break;
            case 'pending':
                filtered = appointments.filter(a => a.status === 'pending' || a.status === 'booked');
                break;
            case 'canceled':
                filtered = appointments.filter(a => a.status === 'canceled');
                break;
            default:
                filtered = appointments;
        }

        // Apply date filter if a specific date is selected (and it's not "today" filter)
        if (selectedFilter !== 'today' && !isToday) {
            filtered = filtered.filter(a => a.date === selectedDate);
        }

        // Sort by date and time
        return filtered.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            
            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
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
            case 'canceled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const updateAppointmentStatus = (id, newStatus, clientName) => {
        const statusMessages = {
            confirmed: {
                title: 'Confirm Appointment',
                message: `Are you sure you want to confirm the appointment for ${clientName}?`,
                type: 'success'
            },
            booked: {
                title: 'Reactivate Appointment',
                message: `Are you sure you want to reactivate the appointment for ${clientName}?`,
                type: 'success'
            }
        };

        const statusInfo = statusMessages[newStatus] || {
            title: `Update Appointment Status`,
            message: `Are you sure you want to change the status to "${newStatus}" for ${clientName}?`,
            type: 'default'
        };

        showConfirmation(
            statusInfo.title,
            statusInfo.message,
            statusInfo.type,
            async () => {
                try {
                    const response = await fetch(`/api/admin-public/appointments/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: newStatus })
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Refresh appointments list
                        loadAppointments();
                        showNotification(
                            'Status Updated',
                            `Appointment for ${clientName} has been ${newStatus} successfully!`,
                            'success'
                        );
                    } else {
                        throw new Error(result.message || 'Failed to update appointment');
                    }
                } catch (error) {
                    console.error('Failed to update appointment:', error);
                    showNotification(
                        'Update Failed',
                        `Failed to update appointment: ${error.message}`,
                        'error'
                    );
                }
            }
        );
    };

    const deleteAppointment = (id, clientName) => {
        showConfirmation(
            'Cancel Appointment',
            `Are you sure you want to cancel the appointment for ${clientName}? This action will mark the appointment as canceled.`,
            'danger',
            async () => {
                try {
                    const response = await fetch(`/api/admin-public/appointments/${id}`, {
                        method: 'DELETE'
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Refresh appointments list
                        loadAppointments();
                        showNotification(
                            'Appointment Canceled',
                            `Appointment for ${clientName} has been canceled successfully.`,
                            'success'
                        );
                    } else {
                        throw new Error(result.message || 'Failed to cancel appointment');
                    }
                } catch (error) {
                    console.error('Failed to cancel appointment:', error);
                    showNotification(
                        'Cancellation Failed',
                        `Failed to cancel appointment: ${error.message}`,
                        'error'
                    );
                }
            }
        );
    };

    const editAppointment = (appointment) => {
        setEditingAppointment(appointment);
        setShowEditAppointmentModal(true);
    };

    const makePayment = (appointment) => {
        setPaymentAppointment(appointment);
        setShowPaymentModal(true);
    };

    const filteredAppointments = getFilteredAndSortedAppointments();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Sort Controls */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sort:</span>
                        <button
                            onClick={() => setSortOrder('desc')}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                sortOrder === 'desc' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Newest First
                        </button>
                        <button
                            onClick={() => setSortOrder('asc')}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                sortOrder === 'asc' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Oldest First
                        </button>
                    </div>

                    {/* View Mode Controls */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">View:</span>
                        <button
                            onClick={() => setViewMode('card')}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                viewMode === 'card' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            📋 Cards
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            📋 List
                        </button>
                    </div>

                    {/* Date and New Appointment */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                                    !isToday 
                                        ? 'border-purple-300 bg-purple-50 text-purple-700' 
                                        : 'border-gray-300'
                                }`}
                            />
                            {!isToday && (
                                <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
                            )}
                        </div>
                        {!isToday && (
                            <button
                                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors whitespace-nowrap"
                                title="Clear date filter"
                            >
                                Clear Date
                            </button>
                        )}
                        <button 
                            onClick={() => setShowNewAppointmentModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap"
                        >
                            New Appointment
                        </button>
                    </div>
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
                {loading ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">Loading appointments...</p>
                    </Card>
                ) : filteredAppointments.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">No appointments found for the selected filter.</p>
                    </Card>
                ) : viewMode === 'card' ? (
                    // Card View - 3 cards per row
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredAppointments.map(appointment => (
                            <Card key={appointment.id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="space-y-3">
                                    {/* Header with name and badges */}
                                    <div className="flex flex-col space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {appointment.client.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                                                {appointment.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Service Info */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{appointment.service.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {appointment.service.duration} min • ${appointment.service.price}
                                        </p>
                                    </div>

                                    {/* Date & Time */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(appointment.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500">{appointment.time}</p>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <p className="text-xs text-gray-600 truncate">{appointment.client.email}</p>
                                        <p className="text-xs text-gray-600">{appointment.client.phone}</p>
                                    </div>

                                    {/* Notes */}
                                    {appointment.notes && appointment.notes !== 'No notes' && (
                                        <div>
                                            <p className="text-xs text-gray-700 line-clamp-2">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                        {(appointment.status === 'pending' || appointment.status === 'booked') && appointment.paymentStatus === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => makePayment(appointment)}
                                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                                                >
                                                    💳 Make Payment
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed', appointment.client.name)}
                                                    className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                                                >
                                                    Confirm
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === 'pending' && appointment.paymentStatus !== 'pending' && (
                                            <button
                                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed', appointment.client.name)}
                                                className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {appointment.status === 'canceled' && (
                                            <button
                                                onClick={() => updateAppointmentStatus(appointment.id, 'booked', appointment.client.name)}
                                                className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                                            >
                                                Reactivate
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => editAppointment(appointment)}
                                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                                        >
                                            {appointment.status === 'canceled' ? 'Restore' : 'Edit'}
                                        </button>
                                        {appointment.status !== 'canceled' && (
                                            <>
                                                <button 
                                                    onClick={() => editAppointment(appointment)}
                                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    Reschedule
                                                </button>
                                                <button 
                                                    onClick={() => deleteAppointment(appointment.id, appointment.client.name)}
                                                    className="px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // List View
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.map(appointment => (
                                        <tr key={appointment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.client.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.client.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.client.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {appointment.service.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {appointment.service.duration} min • ${appointment.service.price}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(appointment.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {appointment.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                                                    {appointment.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {(appointment.status === 'pending' || appointment.status === 'booked') && appointment.paymentStatus === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => makePayment(appointment)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Make Payment"
                                                            >
                                                                💳 Pay
                                                            </button>
                                                            <button
                                                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed', appointment.client.name)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Confirm
                                                            </button>
                                                        </>
                                                    )}
                                                    {appointment.status === 'pending' && appointment.paymentStatus !== 'pending' && (
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed', appointment.client.name)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {appointment.status === 'canceled' && (
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'booked', appointment.client.name)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Reactivate
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => editAppointment(appointment)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        {appointment.status === 'canceled' ? 'Restore' : 'Edit'}
                                                    </button>
                                                    {appointment.status !== 'canceled' && (
                                                        <button 
                                                            onClick={() => deleteAppointment(appointment.id, appointment.client.name)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
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
                            {filteredAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'paid').length}
                        </p>
                        <p className="text-sm text-gray-600">Confirmed</p>
                    </div>
                </Card>
            </div>

            {/* New Appointment Modal */}
            <NewAppointmentModal 
                isOpen={showNewAppointmentModal}
                onClose={() => setShowNewAppointmentModal(false)}
                onSuccess={(appointment) => {
                    console.log('New appointment created:', appointment);
                    setShowNewAppointmentModal(false);
                    // Refresh appointments list
                    loadAppointments();
                    showNotification(
                        'Appointment Created',
                        `Appointment created successfully for ${appointment.customer.name}!`,
                        'success'
                    );
                }}
            />

            {/* Edit Appointment Modal */}
            <EditAppointmentModal 
                isOpen={showEditAppointmentModal}
                onClose={() => {
                    setShowEditAppointmentModal(false);
                    setEditingAppointment(null);
                }}
                appointment={editingAppointment}
                onSuccess={(appointment) => {
                    console.log('Appointment updated:', appointment);
                    setShowEditAppointmentModal(false);
                    setEditingAppointment(null);
                    // Refresh appointments list
                    loadAppointments();
                    showNotification(
                        'Appointment Updated',
                        `Appointment updated successfully!`,
                        'success'
                    );
                }}
            />

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => {
                    setShowPaymentModal(false);
                    setPaymentAppointment(null);
                }}
                appointment={paymentAppointment}
                onSuccess={(paymentResult) => {
                    console.log('Payment successful:', paymentResult);
                    setShowPaymentModal(false);
                    setPaymentAppointment(null);
                    // Refresh appointments list
                    loadAppointments();
                    showNotification(
                        'Payment Successful',
                        `Payment of $${paymentResult.amountPaid} processed successfully for ${paymentResult.customerName}!`,
                        'success'
                    );
                }}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText="Yes, Continue"
                cancelText="Cancel"
            />

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={closeNotificationModal}
                title={notificationModal.title}
                message={notificationModal.message}
                type={notificationModal.type}
                autoClose={true}
                autoCloseDelay={3000}
            />
        </div>
    );
};

export default AdminAppointments;
import React from 'react';
import { Card } from '../../../components/ui/card';

const AdminOverview = () => {
    // Mock data - in real app this would come from API
    const stats = {
        todayAppointments: 5,
        weekAppointments: 28,
        monthRevenue: 2480,
        totalClients: 142
    };

    const recentAppointments = [
        { id: 1, client: 'Sarah Johnson', service: "Women's Cut & Style", time: '10:00 AM', status: 'confirmed' },
        { id: 2, client: 'Mike Davis', service: "Men's Cut & Style", time: '2:30 PM', status: 'confirmed' },
        { id: 3, client: 'Emily Carter', service: 'Color Service', time: '4:00 PM', status: 'pending' },
        { id: 4, client: 'Jessica Brown', service: 'Blowout & Style', time: '6:00 PM', status: 'confirmed' },
    ];

    const upcomingTasks = [
        { id: 1, task: 'Prepare color for Emily Carter (4:00 PM)', priority: 'high' },
        { id: 2, task: 'Order new hair products', priority: 'medium' },
        { id: 3, task: 'Confirm tomorrow\'s appointments', priority: 'high' },
        { id: 4, task: 'Update social media photos', priority: 'low' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-4 border-red-400 bg-red-50';
            case 'medium': return 'border-l-4 border-yellow-400 bg-yellow-50';
            case 'low': return 'border-l-4 border-green-400 bg-green-50';
            default: return 'border-l-4 border-gray-400 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                        </div>
                        <div className="text-3xl">📅</div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">This Week</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.weekAppointments}</p>
                        </div>
                        <div className="text-3xl">📊</div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Month Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.monthRevenue}</p>
                        </div>
                        <div className="text-3xl">💰</div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Total Clients</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                        </div>
                        <div className="text-3xl">👥</div>
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Today's Appointments */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Today's Appointments</h3>
                        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-3">
                        {recentAppointments.map(appointment => (
                            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{appointment.client}</p>
                                    <p className="text-sm text-gray-600">{appointment.service}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button className="w-full text-center py-2 text-purple-600 hover:text-purple-700 font-medium">
                            View All Appointments →
                        </button>
                    </div>
                </Card>

                {/* Tasks & Reminders */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Tasks & Reminders</h3>
                    <div className="space-y-3">
                        {upcomingTasks.map(task => (
                            <div key={task.id} className={`p-3 rounded-lg ${getPriorityColor(task.priority)}`}>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                                    <span className="text-xs text-gray-600 capitalize">{task.priority}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors">
                            Add New Task
                        </button>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-2xl mb-2">📅</span>
                        <span className="text-sm font-medium">New Appointment</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-2xl mb-2">🚫</span>
                        <span className="text-sm font-medium">Block Date</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-2xl mb-2">👤</span>
                        <span className="text-sm font-medium">Add Client</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-2xl mb-2">💳</span>
                        <span className="text-sm font-medium">View Payments</span>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AdminOverview;
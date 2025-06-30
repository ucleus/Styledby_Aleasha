import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus, 
  UserPlus,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';
import NewAppointmentModal from './NewAppointmentModal';
import NewClientModal from './NewClientModal';

const AdminOverview = () => {
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    
    console.log('AdminOverview render - showNewAppointmentModal:', showNewAppointmentModal);
    
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

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'default';
            case 'pending': return 'secondary';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-4 border-destructive bg-destructive/5';
            case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10';
            case 'low': return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-500/10';
            default: return 'border-l-4 border-border bg-muted/50';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
                </div>
                <Button onClick={() => setShowNewClientModal(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Client
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.weekAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Month Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.monthRevenue}</div>
                        <p className="text-xs text-muted-foreground">
                            +8% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            +5 new this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Today's Appointments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
                        <Badge variant="outline" className="text-xs">
                            {new Date().toLocaleDateString()}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentAppointments.map(appointment => (
                            <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="flex-1">
                                    <p className="font-medium">{appointment.client}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <Clock className="h-3 w-3" />
                                        {appointment.time}
                                    </div>
                                    <Badge variant={getStatusVariant(appointment.status)} className="text-xs">
                                        {appointment.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full justify-center">
                            View All Appointments
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Tasks & Reminders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Tasks & Reminders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingTasks.map(task => (
                            <div key={task.id} className={cn("p-3 rounded-lg", getPriorityColor(task.priority))}>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{task.task}</p>
                                    <Badge variant="outline" className="text-xs capitalize">
                                        {task.priority}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        <Button className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Task
                        </Button>
                    </CardContent>
                </Card>
            </div>


            {/* New Appointment Modal */}
            <NewAppointmentModal 
                isOpen={showNewAppointmentModal}
                onClose={() => setShowNewAppointmentModal(false)}
                onSuccess={(appointment) => {
                    console.log('New appointment created:', appointment);
                    setShowNewAppointmentModal(false);
                    // TODO: Refresh appointments list or show success message
                    alert(`Appointment created successfully for ${appointment.customer.name}!`);
                }}
            />

            {/* New Client Modal */}
            <NewClientModal 
                isOpen={showNewClientModal}
                onClose={() => setShowNewClientModal(false)}
                onSuccess={(client) => {
                    console.log('New client created:', client);
                    setShowNewClientModal(false);
                    // TODO: Refresh clients list or show success message
                    alert(`Client created successfully: ${client.fName} ${client.lName}!`);
                }}
            />
        </div>
    );
};

export default AdminOverview;
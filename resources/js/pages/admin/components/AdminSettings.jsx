import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        // Business Settings
        businessName: 'Styles by Aleasha',
        businessPhone: '(555) 123-4567',
        businessEmail: 'info@stylesbyaleasha.com',
        businessAddress: '123 Main Street, City, State 12345',
        
        // Payment Settings
        paymentProcessor: 'stripe', // 'stripe', 'square', 'paypal'
        requireDeposit: true,
        depositPercentage: 50,
        
        // Booking Settings
        bookingWindow: 30, // days in advance
        cancelWindow: 24, // hours before appointment
        autoConfirm: false,
        
        // Notification Settings
        emailNotifications: true,
        smsNotifications: true,
        reminderHours: 24,
        
        // Calendar Settings
        workingHours: {
            start: '09:00',
            end: '17:00'
        },
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        timeSlotInterval: 30, // minutes
        
        // Social Media
        instagram: '@stylesbyaleasha',
        facebook: 'facebook.com/stylesbyaleasha',
        website: 'www.stylesbyaleasha.com'
    });

    const [activeTab, setActiveTab] = useState('business');
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const tabs = [
        { id: 'business', label: 'Business Info', icon: '🏢' },
        { id: 'payment', label: 'Payment', icon: '💳' },
        { id: 'booking', label: 'Booking Rules', icon: '📅' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'calendar', label: 'Calendar', icon: '🗓️' },
        { id: 'social', label: 'Social Media', icon: '📱' }
    ];

    const paymentProcessors = [
        { id: 'stripe', name: 'Stripe', description: 'Credit cards, Apple Pay, Google Pay' },
        { id: 'square', name: 'Square', description: 'In-person and online payments' },
        { id: 'paypal', name: 'PayPal', description: 'PayPal accounts and cards' }
    ];

    const weekDays = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' }
    ];

    const handleSettingChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: typeof prev[section] === 'object' 
                ? { ...prev[section], [field]: value }
                : value
        }));
        setUnsavedChanges(true);
    };

    const handleSimpleChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
        setUnsavedChanges(true);
    };

    const saveSettings = () => {
        console.log('Saving settings:', settings);
        // TODO: Send to backend
        setUnsavedChanges(false);
        alert('Settings saved successfully!');
    };

    const renderBusinessSettings = () => (
        <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Business Name</label>
                    <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => handleSimpleChange('businessName', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={settings.businessPhone}
                        onChange={(e) => handleSimpleChange('businessPhone', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => handleSimpleChange('businessEmail', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Business Address</label>
                <textarea
                    value={settings.businessAddress}
                    onChange={(e) => handleSimpleChange('businessAddress', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-20 resize-none"
                />
            </div>
        </div>
    );

    const renderPaymentSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-3">Primary Payment Processor</label>
                <div className="space-y-3">
                    {paymentProcessors.map(processor => (
                        <label key={processor.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                name="paymentProcessor"
                                value={processor.id}
                                checked={settings.paymentProcessor === processor.id}
                                onChange={(e) => handleSimpleChange('paymentProcessor', e.target.value)}
                                className="mr-3 text-purple-600"
                            />
                            <div>
                                <div className="font-medium">{processor.name}</div>
                                <div className="text-sm text-gray-600">{processor.description}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.requireDeposit}
                            onChange={(e) => handleSimpleChange('requireDeposit', e.target.checked)}
                            className="mr-2 text-purple-600"
                        />
                        <span className="font-medium">Require deposit for bookings</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Deposit Percentage</label>
                    <input
                        type="number"
                        value={settings.depositPercentage}
                        onChange={(e) => handleSimpleChange('depositPercentage', parseInt(e.target.value))}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min="0"
                        max="100"
                        disabled={!settings.requireDeposit}
                    />
                </div>
            </div>
        </div>
    );

    const renderCalendarSettings = () => (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Opening Time</label>
                    <input
                        type="time"
                        value={settings.workingHours.start}
                        onChange={(e) => handleSettingChange('workingHours', 'start', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Closing Time</label>
                    <input
                        type="time"
                        value={settings.workingHours.end}
                        onChange={(e) => handleSettingChange('workingHours', 'end', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-3">Working Days</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map(day => (
                        <label key={day.id} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={settings.workingDays.includes(day.id)}
                                onChange={(e) => {
                                    const newWorkingDays = e.target.checked
                                        ? [...settings.workingDays, day.id]
                                        : settings.workingDays.filter(d => d !== day.id);
                                    handleSimpleChange('workingDays', newWorkingDays);
                                }}
                                className="mr-2 text-purple-600"
                            />
                            <span className="text-sm">{day.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Time Slot Interval (minutes)</label>
                <select
                    value={settings.timeSlotInterval}
                    onChange={(e) => handleSimpleChange('timeSlotInterval', parseInt(e.target.value))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                </select>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'business': return renderBusinessSettings();
            case 'payment': return renderPaymentSettings();
            case 'calendar': return renderCalendarSettings();
            default: return <div className="p-8 text-center text-gray-500">Coming soon...</div>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                {unsavedChanges && (
                    <button
                        onClick={saveSettings}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <Card className="p-6">
                {renderTabContent()}
            </Card>

            {unsavedChanges && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        ⚠️ You have unsaved changes. Don't forget to save your settings.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
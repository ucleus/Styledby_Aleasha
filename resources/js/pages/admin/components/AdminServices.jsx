import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';

const AdminServices = () => {
    const [services, setServices] = useState([
        {
            id: 1,
            name: "Women's Cut & Style",
            description: 'Includes consultation, shampoo, precision cut, and style.',
            duration: 60,
            price: 85,
            category: 'Hair Cut',
            active: true
        },
        {
            id: 2,
            name: "Men's Cut & Style",
            description: 'Includes consultation, shampoo, precision cut, and style.',
            duration: 45,
            price: 45,
            category: 'Hair Cut',
            active: true
        },
        {
            id: 3,
            name: 'Color Service',
            description: 'Full color, balayage, highlights, or color correction.',
            duration: 120,
            price: 120,
            category: 'Color',
            active: true
        },
        {
            id: 4,
            name: 'Blowout & Style',
            description: 'Shampoo, blow dry, and styling for any occasion.',
            duration: 45,
            price: 55,
            category: 'Styling',
            active: true
        },
        {
            id: 5,
            name: 'Formal/Updo Styling',
            description: 'Special occasion styling for weddings, proms, and events.',
            duration: 60,
            price: 85,
            category: 'Styling',
            active: true
        },
        {
            id: 6,
            name: 'Deep Conditioning Treatment',
            description: 'Intensive repair and hydration for damaged hair.',
            duration: 30,
            price: 35,
            category: 'Treatment',
            active: true
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
        category: 'Hair Cut'
    });

    const categories = ['Hair Cut', 'Color', 'Styling', 'Treatment', 'Other'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            duration: '',
            price: '',
            category: 'Hair Cut'
        });
        setEditingService(null);
        setShowAddForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingService) {
            // Update existing service
            setServices(prev => prev.map(service => 
                service.id === editingService.id 
                    ? { ...service, ...formData, duration: parseInt(formData.duration), price: parseFloat(formData.price) }
                    : service
            ));
        } else {
            // Add new service
            const newService = {
                id: Math.max(...services.map(s => s.id)) + 1,
                ...formData,
                duration: parseInt(formData.duration),
                price: parseFloat(formData.price),
                active: true
            };
            setServices(prev => [...prev, newService]);
        }
        
        resetForm();
    };

    const editService = (service) => {
        setFormData({
            name: service.name,
            description: service.description,
            duration: service.duration.toString(),
            price: service.price.toString(),
            category: service.category
        });
        setEditingService(service);
        setShowAddForm(true);
    };

    const toggleServiceStatus = (id) => {
        setServices(prev => prev.map(service => 
            service.id === id ? { ...service, active: !service.active } : service
        ));
    };

    const deleteService = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            setServices(prev => prev.filter(service => service.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Add New Service
                </button>
            </div>

            {/* Add/Edit Service Form */}
            {showAddForm && (
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Service Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-20 resize-none"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                {editingService ? 'Update Service' : 'Add Service'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Services Grid */}
            <div className="grid gap-4">
                {services.map(service => (
                    <Card key={service.id} className={`p-6 ${!service.active ? 'opacity-50' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                        {service.category}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        service.active 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {service.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 mb-3">{service.description}</p>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>⏱️ {service.duration} minutes</span>
                                    <span>💰 ${service.price}</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                                <button
                                    onClick={() => editService(service)}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => toggleServiceStatus(service.id)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        service.active
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    {service.active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => deleteService(service.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Services Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{services.length}</p>
                        <p className="text-sm text-gray-600">Total Services</p>
                    </div>
                </Card>
                
                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {services.filter(s => s.active).length}
                        </p>
                        <p className="text-sm text-gray-600">Active Services</p>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            ${Math.min(...services.map(s => s.price))} - ${Math.max(...services.map(s => s.price))}
                        </p>
                        <p className="text-sm text-gray-600">Price Range</p>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                            {Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)} min
                        </p>
                        <p className="text-sm text-gray-600">Avg Duration</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminServices;
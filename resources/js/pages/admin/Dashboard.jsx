import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Admin dashboard components
const Overview = () => <div className="p-4">Admin Overview Dashboard</div>;
const Appointments = () => <div className="p-4">Manage Appointments</div>;
const Services = () => <div className="p-4">Manage Services</div>;
const Availability = () => <div className="p-4">Manage Availability</div>;

const Dashboard = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 font-playfair">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/appointments" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Appointments
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/services" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/availability" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Availability
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="services" element={<Services />} />
          <Route path="availability" element={<Availability />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
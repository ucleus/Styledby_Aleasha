import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/card';

const servicesList = [
  {
    id: 1,
    name: 'Women\'s Cut & Style',
    description: 'Includes consultation, shampoo, precision cut, and style.',
    duration: 60,
    price: 85,
  },
  {
    id: 2,
    name: 'Men\'s Cut & Style',
    description: 'Includes consultation, shampoo, precision cut, and style.',
    duration: 45,
    price: 45,
  },
  {
    id: 3,
    name: 'Color Service',
    description: 'Full color, balayage, highlights, or color correction.',
    duration: 120,
    price: 120,
  },
  {
    id: 4,
    name: 'Blowout & Style',
    description: 'Shampoo, blow dry, and styling for any occasion.',
    duration: 45,
    price: 55,
  },
  {
    id: 5,
    name: 'Formal/Updo Styling',
    description: 'Special occasion styling for weddings, proms, and events.',
    duration: 60,
    price: 85,
  },
  {
    id: 6,
    name: 'Deep Conditioning Treatment',
    description: 'Intensive repair and hydration for damaged hair.',
    duration: 30,
    price: 35,
  },
];

const Services = () => {
  return (
    <section className="py-16 bg-gray-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-playfair mb-4">Our Services</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            From everyday styles to special occasion looks, we offer a full range of professional hair services
            to help you look and feel your best.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{service.duration} min</span>
                  <span className="font-semibold">${service.price}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/booking"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-16 bg-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-playfair mb-6">Ready for a Fresh New Look?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Book your appointment today and experience the difference that professional styling can make.
        </p>
        <Link 
          to="/booking" 
          className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition-colors inline-block"
        >
          Book Your Appointment
        </Link>
      </div>
    </section>
  );
};

export default CTA;
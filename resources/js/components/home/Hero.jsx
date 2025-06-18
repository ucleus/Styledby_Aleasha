import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen w-full flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
            Styles by Aleasha
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
            Professional hair styling services tailored to your unique look. 
            Experience the confidence that comes with a perfect hairstyle.
          </p>
          <div className="flex gap-4">
            <Link 
              to="/booking" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
            >
              Book Now
            </Link>
            <Link 
              to="#services" 
              className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-8 rounded-md border border-purple-600 transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
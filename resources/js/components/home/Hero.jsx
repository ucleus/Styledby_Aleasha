import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  // You can replace this with your actual image URL
  const heroImage = "/images/Lemonade_braids.jpg"; // Place your image in public/images/
  
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Styles by Aleasha - Professional Hair Styling" 
          className="w-full h-full object-cover"
          onLoad={(e) => {
            console.log('Hero image loaded successfully!');
            e.target.style.opacity = '1';
          }}
          onError={(e) => {
            console.error('Hero image failed to load:', heroImage);
            // Fallback to gradient background if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('bg-gradient-to-r', 'from-purple-100', 'to-pink-100');
          }}
          style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Fallback gradient background (shows if no image) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-100 to-pink-100"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Styles by Aleasha
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 drop-shadow-md">
              Professional hair styling services tailored to your unique look. 
              Experience the confidence that comes with a perfect hairstyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/booking" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-lg"
              >
                Book Now
              </Link>
              <Link 
                to="#services" 
                className="bg-white/90 hover:bg-white text-purple-600 font-bold py-3 px-8 rounded-md border border-white/50 transition-colors backdrop-blur-sm"
              >
                View Services
              </Link>
            </div>
          </div>
          
          {/* Optional: Side Image/Profile Picture */}
          <div className="flex-1 max-w-md lg:max-w-lg">
            <div className="relative">
              <img 
                src="/images/aleasha-profile.jpg" // Optional profile/styling image
                alt="Aleasha - Professional Hair Stylist"
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  // Hide profile image if it doesn't exist
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
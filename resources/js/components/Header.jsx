import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-playfair">Styles by Aleasha</Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-800 hover:text-purple-600 transition">Home</Link>
            </li>
            <li>
              <Link to="/booking" className="text-gray-800 hover:text-purple-600 transition">Book Now</Link>
            </li>
            <li>
              <Link to="/login" className="text-gray-800 hover:text-purple-600 transition">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
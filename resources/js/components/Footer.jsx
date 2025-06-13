import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2 font-playfair">Styles by Aleasha</h3>
            <p className="text-gray-300">Professional hair styling services</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Contact</h4>
            <p className="text-gray-300">Email: info@stylesbyaleasha.com</p>
            <p className="text-gray-300">Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Styles by Aleasha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
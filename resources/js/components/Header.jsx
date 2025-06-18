import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (to) => {
    console.log('Navigating to:', to); // Debug log
    closeMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Dynamic navigation based on authentication status
  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home' },
      { to: '/booking', label: 'Book Now', highlight: true },
    ];

    if (loading) {
      return baseLinks; // Don't show auth links while loading
    }

    if (user) {
      return [
        ...baseLinks,
        { 
          action: 'profile', 
          label: user.displayName || user.email?.split('@')[0] || 'Profile',
          isProfile: true 
        },
        { action: 'logout', label: 'Logout' }
      ];
    } else {
      return [
        ...baseLinks,
        { to: '/login', label: 'Login' }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold font-playfair text-purple-600"
            onClick={closeMenu}
          >
            Styles by Aleasha
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-6 items-center">
              {navLinks.map((link, index) => (
                <li key={link.to || link.action || index}>
                  {link.action === 'logout' ? (
                    <button
                      onClick={handleLogout}
                      className="text-gray-800 hover:text-purple-600 transition font-medium"
                    >
                      {link.label}
                    </button>
                  ) : link.isProfile ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-gray-800 font-medium">{link.label}</span>
                    </div>
                  ) : (
                    <Link 
                      to={link.to} 
                      className={`${
                        link.highlight 
                          ? 'bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700' 
                          : 'text-gray-800 hover:text-purple-600'
                      } transition font-medium`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span 
              className={`w-6 h-0.5 bg-gray-800 transform transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span 
              className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`w-6 h-0.5 bg-gray-800 transform transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out relative z-50 ${
            isMenuOpen 
              ? 'max-h-64 opacity-100 mt-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <nav className="bg-gray-50 rounded-lg p-4 shadow-lg">
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={link.to || link.action || index}>
                  {link.highlight ? (
                    // Special handling for Book Now button
                    <button
                      onClick={() => {
                        console.log('Book Now clicked!');
                        closeMenu();
                        try {
                          navigate('/booking');
                          console.log('Navigation attempted with useNavigate');
                        } catch (error) {
                          console.error('Navigation failed:', error);
                          // Fallback to window.location
                          window.location.href = window.location.origin + '/booking';
                        }
                      }}
                      className="block w-full text-center px-4 py-4 rounded-md transition bg-purple-600 text-white active:bg-purple-800 font-bold min-h-[48px] cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ) : link.action === 'logout' ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 rounded-md transition text-gray-800 hover:bg-purple-50 hover:text-purple-600"
                    >
                      {link.label}
                    </button>
                  ) : link.isProfile ? (
                    <div className="flex items-center px-4 py-3 rounded-md bg-purple-50">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-gray-800 font-medium">{link.label}</span>
                    </div>
                  ) : (
                    <Link 
                      to={link.to}
                      onClick={() => handleNavigation(link.to)}
                      className="block w-full text-left px-4 py-3 rounded-md transition text-gray-800 hover:bg-purple-50 hover:text-purple-600"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={closeMenu}
        />
      )}
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { FaLeaf, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear the user from localStorage
    localStorage.removeItem('currentUser');
    // Redirect to homepage
    window.location.href = '/';
    setShowDropdown(false);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white shadow-lg py-6 px-8 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div className="flex items-center gap-4 text-3xl font-extrabold tracking-wide">
        <FaLeaf className="text-yellow-300 animate-spin-slow" />
        <span className="drop-shadow-lg">Green House Management</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="text-lg font-medium">
            Welcome back, {currentUser ? currentUser.name.split(' ')[0] : ''}
          </p>
          <p className="text-sm italic opacity-90">
            {currentUser ? currentUser.role : 'Sustainability starts here'}
          </p>
        </div>
        <div className="relative">
          <FaUserCircle 
            className="text-4xl text-yellow-300 cursor-pointer hover:text-yellow-200 transition-colors" 
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link 
                to="/e_profile_dashboard" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                onClick={() => setShowDropdown(false)}
              >
                View Profile
              </Link>
              <a 
                href="#" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                onClick={handleLogout}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
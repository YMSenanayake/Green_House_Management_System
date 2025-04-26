import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white text-center text-sm py-6 shadow-inner w-full">
      <p className="mb-2">© {new Date().getFullYear()} <span className="font-bold">Green House Management</span></p>
      <p className="text-gray-400">Built with ❤️ for a sustainable future</p>
    </footer>
  );
};

export default Footer;
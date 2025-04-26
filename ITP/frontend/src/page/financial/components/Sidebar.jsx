import React from 'react';
import { FaChartPie, FaList, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="h-screen bg-gradient-to-b from-green-700 to-green-900 text-white shadow-lg w-64 fixed top-0 left-0 pt-24 px-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">Green House</h2>
      <nav className="flex flex-col gap-6 text-base">
        <Link to="/fhinancialdashboard" className="flex items-center gap-3 hover:bg-green-600 px-4 py-2 rounded transition">
          <FaChartPie className="text-yellow-300" />
          <span>Dashboard</span>
        </Link>
        <Link to="/financialist" className="flex items-center gap-3 hover:bg-green-600 px-4 py-2 rounded transition">
          <FaList className="text-yellow-300" />
          <span>All Entries</span>
        </Link>
        <Link to="/addfinacial" className="flex items-center gap-3 hover:bg-green-600 px-4 py-2 rounded transition">
          <FaPlusCircle className="text-yellow-300" />
          <span>Add Entry</span>
        </Link>
      </nav>
      <div className="mt-auto text-center text-sm text-gray-300">
        <p>© {new Date().getFullYear()} Green House</p>
        <p>All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
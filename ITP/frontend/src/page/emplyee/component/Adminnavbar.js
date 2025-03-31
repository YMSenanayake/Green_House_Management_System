import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { GiExitDoor } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

import logo from "../../../Images/logo.png";

function Adminnavbar() {
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem("currentuser"));

  function Logout() {
    localStorage.removeItem("currentuser");
    localStorage.removeItem("user:detail");
    window.location.href = "/";
  }

  
  const navItems = [
    {
      path: "/employeeDashboard",
      icon: <LuLayoutDashboard className="text-xl" />,
      label: "Dashboard"
    },
    {
      path: "/e_allusers",
      icon: <FaUsers className="text-xl" />,
      label: "Users"
    },
    {
      path: "/e_approveleave",
      icon: <GiExitDoor className="text-xl" />,
      label: "Leaves"
    },
    {
      path: "/e_requestedleave",
      icon: <FaUserClock className="text-xl" />,
      label: "Leave Request"
    }
  ];
  
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 h-screen w-64 fixed top-0 left-0 flex flex-col justify-between shadow-lg border-r border-green-200">
      <div className="flex flex-col items-center pt-8 pb-8 border-b border-green-200">
        {/* Profile button - circular */}
        <Link to={`/u_userprofile/${user._id}`} className="mb-4">
          <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white shadow-md hover:bg-green-700 transition-all duration-200">
            <FaUserCircle className="text-3xl" />
          </div>
        </Link>
        <span className="text-green-800 font-medium">My Profile</span>
      </div>

      <div className="flex-grow overflow-y-auto px-4 py-6">
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg mb-10 px-4 py-3 transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'text-green-800 hover:bg-green-500 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-green-200">
        <p className="text-green-700 text-sm font-medium text-center">&copy; 2025 GreenGrow</p>
      </div>
    </div>
  );
}

export default Adminnavbar;
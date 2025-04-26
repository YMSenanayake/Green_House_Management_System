import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { GiExitDoor } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";

function EmployeeSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentuser"));

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      // Clear user data from localStorage
      localStorage.removeItem("currentuser");
      // Redirect to login page
      navigate("/");
    }
  };

  const menuItems = [
    {
      path: "/employeeDashboard",
      name: "Dashboard",
      icon: <LuLayoutDashboard className="text-xl" />
    },
    {
      path: "/e_profile_dashboard",
      name: "Profile Board",
      icon: <IoDocumentTextOutline className="text-xl" />
    },
    {
      path: `/e_userprofile/${user?._id}`,
      name: "Edit Profile",
      icon: <CgProfile className="text-xl" />
    },
    {
      path: "/e_requestedleave",
      name: "My Leaves",
      icon: <GiExitDoor className="text-xl" />
    }
  ];

  return (
    <div
      className="bg-gradient-to-b from-green-50 to-green-100 text-green-900 shadow-lg min-w-[240px] h-screen flex flex-col justify-between fixed left-0 top-0"
      style={{ width: "240px" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center py-6 border-b border-green-200">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-3">
          <span className="text-white text-2xl font-bold">
            {user?.firstName?.charAt(0) || "G"}
          </span>
        </div>
        <h3 className="font-semibold text-green-800">
          {user?.firstName} {user?.lastName || ""}
        </h3>
        <p className="text-sm text-green-600">{user?.role || "Employee"}</p>
      </div>

      {/* Navigation */}
      <div className="flex-grow py-6 px-3 overflow-y-auto">
        <p className="text-xs font-medium text-green-600 uppercase tracking-wider px-4 mb-4">
          Main Navigation
        </p>
        
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center w-full py-3 px-4 mb-6 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-green-600 text-white shadow-md"
                : "hover:bg-green-200 text-green-800"
            }`}
          >
            <div className="mr-3">{item.icon}</div>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-green-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-100 text-red-600 transition-colors duration-300"
        >
          <FiLogOut className="mr-3 text-xl" />
          <span className="font-medium">Logout</span>
        </button>
        <p className="text-green-600 text-xs font-medium text-center mt-4">
          &copy; 2025 GreenGrow 
        </p>
      </div>
    </div>
  );
}

export default EmployeeSidebar;
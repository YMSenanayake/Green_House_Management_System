import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js library
import Adminnavbar from "./component/Adminnavbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Loader from "../../components/header/Loader";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tag } from "antd";
import Navbar from "../../components/header/Navbar";

AOS.init({
  duration: 1500, // Reduced duration for smoother animations
});

function Employeedashboard() {
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [data, setData] = useState(null);
  const [approveleaves, setapproveleaves] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("leaves"); // For dashboard tab navigation
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/leaves/statuscounts")
      .then((response) => {
        setStatusCounts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching status counts:", error);
        setLoading(false);
      });
  }, []);

  //get all leaves
  const allleaves = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:3000/api/leaves/getallleaves"
      );
      setapproveleaves(data.data);
      
      // Get the 5 most recent leave requests
      const sortedLeaves = [...data.data].sort((a, b) => {
        return new Date(b.createdAt || b.fromdate) - new Date(a.createdAt || a.fromdate);
      });
      
      setRecentLeaves(sortedLeaves.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allleaves();
  }, []);

  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/users/getallusers"
      );
      setUsers(response.data);
      setLoading(false);
      // Calculate role counts
      const counts = response.data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      setRoleCounts(counts);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Enhanced color palette with professional and visually distinct colors
  const ROLE_COLORS = {
    employee: "#4f46e5", // Indigo
    courier: "#7c3aed", // Violet
    user: "#db2777", // Pink
    financial: "#ea580c", // Orange
    inventory: "#059669", // Emerald
    machine: "#0891b2", // Cyan
  };

  // Hover colors (slightly lighter)
  const ROLE_HOVER_COLORS = {
    employee: "#6366f1", // Lighter Indigo
    financial: "#f97316", // Lighter Orange
    inventory: "#10b981", // Lighter Emerald
    machine: "#06b6d4", // Lighter Cyan
    tunnel: "#22d3ee", // Lighter Cyan
    user: "#ec4899", // Pink
  };

  // Status colors
  const STATUS_COLORS = {
    pending: "#eab308", // Yellow
    approved: "#22c55e", // Green
    disapproved: "#ef4444", // Red
  };

  // Fallback colors for roles not in the predefined list
  const FALLBACK_COLORS = [
    "#6366f1", // Indigo
    "#c026d3", // Purple
    "#15803d", // Green
    "#b91c1c", // Red
    "#0369a1", // Blue
    "#854d0e", // Yellow
    "#1e3a8a", // Dark Blue
    "#0f766e", // Teal
    "#831843", // Pink
    "#7e22ce", // Violet
  ];

  // Generate a color for a role, using predefined if available, or from fallback array if not
  const getColorForRole = (role, index, isHover = false) => {
    if (isHover) {
      return ROLE_HOVER_COLORS[role] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    }
    return ROLE_COLORS[role] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  // Get color for status
  const getColorForStatus = (status) => {
    return STATUS_COLORS[status] || "#6b7280"; // Default to gray
  };

  // Format date function to handle various date formats
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  // Calculate leave duration in days
  const calculateDuration = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "-";
    
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "-";

    // Use UTC to remove time zone issues
    const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // Calculate difference in days
    const diffDays = Math.round((endUTC - startUTC) / (1000 * 60 * 60 * 24));

    return diffDays + (diffDays === 1 ? " day" : " days");
};

  // Handle leave request refresh
  const handleRefreshLeaves = async () => {
    await allleaves();
  };

  useEffect(() => {
    if (roleCounts && Object.keys(roleCounts).length > 0) {
      const roles = Object.keys(roleCounts);
      
      setData({
        labels: roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)), // Capitalize role names
        datasets: [
          {
            data: roles.map(role => roleCounts[role]),
            backgroundColor: roles.map((role, index) => getColorForRole(role, index)),
            hoverBackgroundColor: roles.map((role, index) => getColorForRole(role, index, true)),
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      });
    }
  }, [roleCounts]);

  // Custom Card component for cleaner code
  const StatCard = ({ title, count, percentage, color, animationDelay }) => (
    <div 
      data-aos="zoom-in" 
      data-aos-delay={animationDelay}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out border-l-4"
      style={{ borderLeftColor: color }}
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">{title}</span>
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {count || 0}
        </span>
      </h2>
      <div className="flex justify-center">
        <div style={{ width: 120, height: 120 }}>
          <CircularProgressbar
            value={percentage || 0}
            text={`${percentage || 0}%`}
            styles={buildStyles({
              pathColor: color,
              textColor: color,
              trailColor: "#e6e6e6",
              textSize: "16px",
            })}
            className="transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex">
            <Adminnavbar />
            <div className="flex-grow ml-64 space-y-6">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-800" data-aos="fade-right">
                  Employee Dashboard
                </h1>
                
                {/* Dashboard Tabs */}
                <div className="flex bg-white rounded-lg shadow-sm p-1" data-aos="fade-left">
                  <button
                    onClick={() => setActiveTab("leaves")}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "leaves"
                        ? "bg-indigo-500 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    Leaves Summary
                  </button>
                  <button
                    onClick={() => setActiveTab("roles")}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "roles"
                        ? "bg-indigo-500 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    User Roles
                  </button>
                </div>
              </div>

              {/* Stats Overview Cards */}
              <div className="grid grid-cols-3 gap-6" data-aos="fade-up">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {users.length}
                      </h3>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Roles</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {Object.keys(roleCounts).length}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Leaves</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {approveleaves.length}
                      </h3>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Leaves Summary Card */}
              {activeTab === "leaves" && (
                <div className="bg-white shadow-lg rounded-xl p-6" data-aos="fade-up">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Employee Leaves Summary
                    </h1>
                    <span className="text-xs font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                      Last Updated: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <StatCard 
                      title="Pending Leaves" 
                      count={statusCounts.pending?.count} 
                      percentage={statusCounts.pending?.percentage} 
                      color={getColorForStatus("pending")}
                      animationDelay="0" 
                    />
                    
                    <StatCard 
                      title="Approved Leaves" 
                      count={statusCounts.approved?.count} 
                      percentage={statusCounts.approved?.percentage} 
                      color={getColorForStatus("approved")}
                      animationDelay="100" 
                    />
                    
                    <StatCard 
                      title="Disapproved Leaves" 
                      count={statusCounts.disapproved?.count} 
                      percentage={statusCounts.disapproved?.percentage} 
                      color={getColorForStatus("disapproved")}
                      animationDelay="200" 
                    />
                  </div>

                  {/* Recent Leave Requests */}
                  <div className="mt-8" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">Recent Leave Requests</h3>
                      <button 
                        onClick={handleRefreshLeaves}
                        className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium hover:bg-indigo-100 transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 overflow-hidden shadow-inner">
                      {recentLeaves.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {recentLeaves.map((leave, index) => (
                                <tr key={leave._id || index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-medium">
                                        {leave.name ? leave.name.charAt(0).toUpperCase() : "U"}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{leave.name || "Employee"}</div>
                                        <div className="text-xs text-gray-500">{leave.email || leave.userId || ""}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{leave.leavetype || "Vacation"}</div>
                                    <div className="text-xs text-gray-500">{leave.reason?.substring(0, 20) || ""}{leave.reason?.length > 20 ? "..." : ""}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(leave.fromdate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(leave.todate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {calculateDuration(leave.fromdate, leave.todate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      leave.status === "approved" ? "bg-green-100 text-green-800" : 
                                      leave.status === "disapproved" ? "bg-red-100 text-red-800" : 
                                      "bg-yellow-100 text-yellow-800"
                                    }`}>
                                      {leave.status || "pending"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="mt-2 text-gray-500">No leave requests found</p>
                          <button 
                            onClick={handleRefreshLeaves}
                            className="mt-3 text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium hover:bg-indigo-100 transition-colors"
                          >
                            Refresh Data
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* User Role Distribution Card */}
              {activeTab === "roles" && (
                <div 
                  data-aos="fade-up" 
                  className="bg-white shadow-lg rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      User Role Distribution
                    </h2>
                    <div className="flex space-x-2">
                      <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium hover:bg-indigo-100 transition-colors">
                        Export Data
                      </button>
                      <button onClick={fetchData} className="text-xs bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                    <div className="grid grid-cols-2 gap-8">
                        {/* Pie Chart */}
                        <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 shadow-inner">
                          {data ? (
                            <div className="w-full h-full flex justify-center items-center" data-aos="zoom-in">
                              <Pie 
                                data={data} 
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'bottom',
                                      labels: {
                                        boxWidth: 12,
                                        usePointStyle: true,
                                        padding: 20,
                                        font: {
                                          size: 11,
                                          weight: 'bold'
                                        }
                                      }
                                    },
                                    tooltip: {
                                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                      padding: 12,
                                      titleFont: {
                                        size: 14,
                                        weight: 'bold'
                                      },
                                      bodyFont: {
                                        size: 13
                                      },
                                      displayColors: true,
                                      callbacks: {
                                        label: function(context) {
                                          const label = context.label || '';
                                          const value = context.raw || 0;
                                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                          const percentage = Math.round((value / total) * 100);
                                          return `${label}: ${value} (${percentage}%)`;
                                        }
                                      }
                                    }
                                  },
                                  cutout: '0%',
                                  radius: '100%',
                                  animation: {
                                    animateScale: true,
                                    animateRotate: true,
                                    duration: 1500,
                                    easing: 'easeOutQuart'
                                  }
                                }} 
                              />
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-500">No role data available</div>
                          )}
                        </div>
                        
                        {/* Role Counts with Progress Bars */}
                        <div className="space-y-4">
                          {Object.entries(roleCounts).map(([role, count], index) => {
                            // Calculate percentage of total users
                            const totalUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0);
                            const percentage = ((count / totalUsers) * 100).toFixed(1);

                            // Determine the delay for animations
                            const delay = index * 100;
                          
                            return (
                              <div 
                                key={role} 
                                data-aos="fade-left"
                                data-aos-delay={delay}
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-2" 
                                      style={{ backgroundColor: getColorForRole(role, index) }}
                                    ></div>
                                    <span className="font-medium text-gray-700 capitalize">{role}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-800 font-bold mr-2">{count}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-1000 ease-out" 
                                    style={{
                                      width: `${percentage}%`, 
                                      backgroundColor: getColorForRole(role, index)
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Summary Card */}
                          <div 
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm"
                          >
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Summary</h4>
                            <div className="flex justify-between text-xs text-gray-600">
                              <div>
                                <div className="font-medium">Total Users</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">
                                  {users.length}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Role Types</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1">
                                  {Object.keys(roleCounts).length}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Primary Role</div>
                                <div className="text-2xl font-bold text-gray-800 mt-1 capitalize">
                                  {Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employeedashboard;
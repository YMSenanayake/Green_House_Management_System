import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import AdprofileNavbar from "./component/AdprofileNavbar";
import Loader from "../../components/header/Loader";
import { GiExitDoor } from "react-icons/gi";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { FaClock, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Employeeprofiledashboard() {
  const [date, setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [rejectLeaves, setRejectLeaves] = useState(0);
  const [todayMarkedIn, setTodayMarkedIn] = useState(false);
  const [todayMarkedOut, setTodayMarkedOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentuser");
      if (!userStr) {
        throw new Error("No user found in localStorage");
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error getting current user:", error);
      Swal.fire({
        title: "Session Error",
        text: "Your session appears to be invalid. Please log in again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      // Redirect to login page or handle as appropriate
      return null;
    }
  };

  const user = getCurrentUser();
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      fetchLeaveCounts(userId);
      checkTodayAttendance(userId);
    }
  }, [userId]);

  // Update clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchLeaveCounts = async (userId) => {
    if (!userId) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/leaves/leaverequestcounts/${userId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPendingLeaves(data.pending || 0);
      setApprovedLeaves(data.approved || 0);
      setRejectLeaves(data.dissapproved || 0);
    } catch (error) {
      console.error("Error fetching leave counts:", error);
      setErrorMessage("Failed to load leave data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async (userId) => {
    if (!userId) return;
    
    try {
      // Format date in yyyy-MM-dd format to ensure consistency
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      console.log("Checking attendance for date:", formattedDate);
      
      // Try to get attendance from attendanceIn collection
      const inResponse = await axios.get(
        `http://localhost:3000/api/attendanceIn/checkStatus/${userId}?date=${formattedDate}`
      );
      
      console.log("Check-in status response:", inResponse.data);
      
      if (inResponse.data && inResponse.data.exists) {
        setTodayMarkedIn(true);
      } else {
        setTodayMarkedIn(false);
      }
      
      // Then check if there's an out record
      const outResponse = await axios.get(
        `http://localhost:3000/api/attendanceOut/checkStatus/${userId}?date=${formattedDate}`
      );
      
      console.log("Check-out status response:", outResponse.data);
      
      if (outResponse.data && outResponse.data.exists) {
        setTodayMarkedOut(true);
      } else {
        setTodayMarkedOut(false);
      }
    } catch (error) {
      console.error("Error checking today's attendance:", error);
      // Set default state to be safe
      setTodayMarkedIn(false);
      setTodayMarkedOut(false);
    }
  };

  const handleMarkIn = async () => {
    if (!userId) {
      Swal.fire({
        title: "Error!",
        text: "User information not found. Please log in again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Format date in yyyy-MM-dd format to ensure consistency
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // Format time in HH:mm:ss format
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const seconds = String(today.getSeconds()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      
      console.log("Sending mark-in request with data:", {
        userid: userId,
        intime: formattedTime,
        date: formattedDate
      });
      
      // First check if already marked in
      const checkResponse = await axios.get(
        `http://localhost:3000/api/attendanceIn/checkStatus/${userId}?date=${formattedDate}`
      );
      
      if (checkResponse.data && checkResponse.data.exists) {
        setTodayMarkedIn(true);
        throw new Error("You have already checked in today.");
      }
      
      // If not already marked in, proceed with the check-in
      const response = await axios.post(
        "http://localhost:3000/api/attendanceIn/mark_in",
        {
          userid: userId,
          intime: formattedTime,
          date: formattedDate,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Mark-in response:", response);
  
      if (response.status === 201 || response.status === 200) {
        setTodayMarkedIn(true);
        Swal.fire({
          title: "Checked In!",
          text: `You have successfully checked in at ${formattedTime}`,
          icon: "success",
          confirmButtonColor: "#38A169",
          timer: 2000
        });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error marking in:", error);
      let errorMsg = "Unable to mark attendance. Please try again.";
      
      if (error.message === "You have already checked in today.") {
        errorMsg = error.message;
      } else if (error.response) {
        console.error("Server error response:", error.response.data);
        // Use server error message if available
        errorMsg = error.response.data.message || errorMsg;
        
        // Special case for duplicate entry
        if (error.response.status === 409) {
          errorMsg = "You have already checked in today.";
          setTodayMarkedIn(true); // Update state to reflect reality
        }
      } else if (error.request) {
        errorMsg = "Server not responding. Please check your connection.";
      }
      
      Swal.fire({
        title: "Error!",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOut = async () => {
    if (!userId) {
      Swal.fire({
        title: "Error!",
        text: "User information not found. Please log in again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    
    if (!todayMarkedIn) {
      Swal.fire({
        title: "Warning!",
        text: "You need to check in before checking out.",
        icon: "warning",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Format date in yyyy-MM-dd format to ensure consistency
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // Format time in HH:mm:ss format
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const seconds = String(today.getSeconds()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      
      console.log("Sending mark-out request with data:", {
        userid: userId,
        outtime: formattedTime,
        date: formattedDate
      });
      
      // First check if already marked out
      const checkResponse = await axios.get(
        `http://localhost:3000/api/attendanceOut/checkStatus/${userId}?date=${formattedDate}`
      );
      
      if (checkResponse.data && checkResponse.data.exists) {
        setTodayMarkedOut(true);
        throw new Error("You have already checked out today.");
      }
      
      // If not already marked out, proceed with the check-out
      const response = await axios.post(
        "http://localhost:3000/api/attendanceOut/mark_out",
        {
          userid: userId,
          outtime: formattedTime,
          date: formattedDate,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Mark-out response:", response);
  
      if (response.status === 201 || response.status === 200) {
        setTodayMarkedOut(true);
        Swal.fire({
          title: "Checked Out!",
          text: `You have successfully checked out at ${formattedTime}`,
          icon: "success",
          confirmButtonColor: "#38A169",
          timer: 2000
        });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error marking out:", error);
      let errorMsg = "Unable to mark attendance. Please try again.";
      
      if (error.message === "You have already checked out today.") {
        errorMsg = error.message;
      } else if (error.response) {
        console.error("Server error response:", error.response.data);
        // Use server error message if available
        errorMsg = error.response.data.message || errorMsg;
        
        // Special case for duplicate entry
        if (error.response.status === 409) {
          errorMsg = "You have already checked out today.";
          setTodayMarkedOut(true); // Update state to reflect reality
        }
      } else if (error.request) {
        errorMsg = "Server not responding. Please check your connection.";
      }
      
      Swal.fire({
        title: "Error!",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Reusable stat card component
  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className={`block w-full p-5 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105`}>
      <h5 className={`mb-2 text-xl font-bold tracking-tight text-${color}`}>
        {title}
      </h5>
      <div className="flex items-center mt-5">
        <div className={`p-3 rounded-full bg-${color} bg-opacity-10`}>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
        <p className="text-3xl font-bold text-gray-700 ml-6">{count}</p>
      </div>
    </div>
  );

  // If no user found, show error
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-6">User information not found. Please log in again.</p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="flex">
          <AdprofileNavbar />
          <div className="flex flex-col w-full p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Employee Profile Board</h1>
              <p className="text-sm text-gray-600">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Approved Leaves" 
                count={approvedLeaves} 
                icon={GiExitDoor} 
                color="green-600" 
              />
              <StatCard 
                title="Pending Leaves" 
                count={pendingLeaves} 
                icon={FaPersonCircleQuestion} 
                color="yellow-500" 
              />
              <StatCard 
                title="Rejected Leaves" 
                count={rejectLeaves} 
                icon={FaRegTimesCircle} 
                color="red-500" 
              />
            </div>

            {/* Calendar and Attendance Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h2>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="border-0 shadow-none w-full"
                  tileClassName="text-center"
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Attendance Tracker
                </h2>
                <div className="flex flex-col items-center mb-4">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {formatTime(currentTime)}
                  </div>
                  <p className="text-sm text-gray-500">Sri Lankan Standard Time</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={handleMarkIn}
                    disabled={todayMarkedIn}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                      todayMarkedIn 
                        ? "bg-green-100 border-green-200" 
                        : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-300"
                    } transition-all duration-300`}
                  >
                    <div className="p-3 rounded-full bg-green-100 mb-2">
                      <FaSignInAlt className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {todayMarkedIn ? "Checked In" : "Check In"}
                    </span>
                    {todayMarkedIn && (
                      <span className="text-xs text-gray-500 mt-1">
                        Today
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleMarkOut}
                    disabled={!todayMarkedIn || todayMarkedOut}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                      todayMarkedOut 
                        ? "bg-blue-100 border-blue-200" 
                        : !todayMarkedIn 
                          ? "bg-gray-100 border-gray-200 cursor-not-allowed" 
                          : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                    } transition-all duration-300`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${
                      !todayMarkedIn && !todayMarkedOut 
                        ? "bg-gray-100" 
                        : todayMarkedOut 
                          ? "bg-blue-100" 
                          : "bg-blue-100"
                    }`}>
                      <FaSignOutAlt className={`w-6 h-6 ${
                        !todayMarkedIn && !todayMarkedOut 
                          ? "text-gray-400" 
                          : todayMarkedOut 
                            ? "text-blue-600" 
                            : "text-blue-600"
                      }`} />
                    </div>
                    <span className="text-sm font-medium">
                      {todayMarkedOut ? "Checked Out" : "Check Out"}
                    </span>
                    {todayMarkedOut && (
                      <span className="text-xs text-gray-500 mt-1">
                        Today
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employeeprofiledashboard;
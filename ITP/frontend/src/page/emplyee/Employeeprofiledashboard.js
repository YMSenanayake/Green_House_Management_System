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

  const user = JSON.parse(localStorage.getItem("currentuser"));
  const userId = user._id;

  useEffect(() => {
    fetchLeaveCounts(userId);
    checkTodayAttendance(userId);
  }, [userId]);

  const fetchLeaveCounts = async (userId) => {
    if (!userId) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/leaves/leaverequestcounts/${userId}`
      );
      const data = await response.json();
      setPendingLeaves(data.pending);
      setApprovedLeaves(data.approved);
      setRejectLeaves(data.dissapproved);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave counts:", error);
      setLoading(false);
    }
  };

  const checkTodayAttendance = async (userId) => {
    // This is a placeholder for checking if the user has already marked in/out today
    // You would implement this based on your actual API
    try {
      const today = new Date().toLocaleDateString();
      // Placeholder implementation - you should replace with actual API call
      const response = await axios.get(
        `http://localhost:3000/api/attendance/status/${userId}?date=${today}`
      );
      
      if (response.data) {
        setTodayMarkedIn(response.data.markedIn || false);
        setTodayMarkedOut(response.data.markedOut || false);
      }
    } catch (error) {
      console.error("Error checking today's attendance:", error);
    }
  };

  const handleMarkIn = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentuser"));

      const response = await axios.post(
        "http://localhost:3000/api/attendanceIn/mark_in",
        {
          userid: currentUser._id,
          intime: currentTime.toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        }
      );

      if (response.status !== 201) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTodayMarkedIn(true);
      setLoading(false);
      Swal.fire({
        title: "Checked In!",
        text: `You have successfully checked in at ${currentTime.toLocaleTimeString()}`,
        icon: "success",
        confirmButtonColor: "#38A169",
        timer: 2000
      });
    } catch (error) {
      console.error("Error marking in:", error);
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Unable to mark attendance. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleMarkOut = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentuser"));

      const response = await axios.post(
        "http://localhost:3000/api/attendanceOut/mark_out",
        {
          userid: currentUser._id,
          outtime: currentTime.toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        }
      );

      if (response.status !== 201) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTodayMarkedOut(true);
      setLoading(false);
      Swal.fire({
        title: "Checked Out!",
        text: `You have successfully checked out at ${currentTime.toLocaleTimeString()}`,
        icon: "success",
        confirmButtonColor: "#38A169",
        timer: 2000
      });
    } catch (error) {
      console.error("Error marking out:", error);
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Unable to mark attendance. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="block w-64 h-36 p-5 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex">
          <AdprofileNavbar />
          <div className="flex flex-col w-full p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
              <p className="text-sm text-gray-600">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                  className="border-0 shadow-none transition-transform duration-300 ease-in-out transform hover:scale-105"
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
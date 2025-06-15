import React, { useState, useEffect } from "react";
import axios from "axios";
import AdprofileNavbar from "./component/AdprofileNavbar";
import { FaEdit, FaEye, FaEyeSlash, FaIdCard, FaEnvelope, FaPhone, FaUserTag, FaShieldAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loader from "../../components/header/Loader";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Initialize AOS animation library
AOS.init({
  duration: 1000,
  once: true, // Animations only happen once
});

function Euserprofile() {
  // State and variables setup
  const user = JSON.parse(localStorage.getItem("currentuser"));
  const { empid } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // User data states
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    imageurl: "",
    role: "",
    lastUpdated: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Security check - redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:3000/api/users/getuser/${empid}`);
        
        if (response.data && response.data.user) {
          const userData = response.data.user;
          setUserData({
            id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            imageurl: userData.imageurl,
            role: userData.role,
            lastUpdated: new Date(userData.updatedAt || Date.now()).toLocaleDateString()
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [empid]);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const confirmed = await Swal.fire({
        title: "Delete Account?",
        text: "This action cannot be undone. All your data will be permanently removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete account",
        cancelButtonText: "Cancel",
        footer: "<span class='text-sm text-gray-500'>You will be logged out immediately</span>"
      });

      if (confirmed.isConfirmed) {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/users/delete/${userData.id}`);
        
        Swal.fire({
          icon: "success",
          title: "Account Deleted",
          text: "Your account has been successfully deleted.",
          timer: 2000,
          showConfirmButton: false
        });
        
        // Clear user data and redirect
        setTimeout(() => {
          localStorage.removeItem("currentuser");
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting account:", error);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete account. Please try again later."
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Information field component
  const InfoField = ({ icon: Icon, label, value, type = "text", isPassword = false }) => (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-gray-700" id={`label-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </label>
      <div className="flex items-center w-full rounded-lg border border-gray-200 bg-white py-3 px-4 text-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-500 transition-all duration-200">
        <Icon className="mr-3 text-blue-500 flex-shrink-0" aria-hidden="true" />
        
        <div className="relative w-full">
          <input
            className="w-full bg-white outline-none border-none focus:ring-0 text-gray-800"
            value={value || ""}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            readOnly
            aria-labelledby={`label-${label.toLowerCase().replace(/\s+/g, '-')}`}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg" />
              ) : (
                <FaEye className="text-lg" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdprofileNavbar />
          <div className="flex flex-col w-full p-4 md:p-6">
            <div className="max-w-4xl mx-auto w-full" data-aos="fade-up">
              {/* Profile Card */}
              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                {/* Profile header with background */}
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img
                      className="w-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60"
                      alt="Profile background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                  </div>
                  
                  {/* Profile image */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                    <div className="w-32 h-32 relative border-4 border-white rounded-full overflow-hidden shadow-lg">
                      <img
                        className="object-cover object-center h-full w-full"
                        src={userData.imageurl || "https://via.placeholder.com/150"}
                        alt={`${userData.fullName}'s profile`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Profile actions */}
                <div className="mt-20 text-center px-6">
                  <h2 className="text-3xl font-bold text-gray-800">{userData.fullName}</h2>
                  <p className="text-blue-600 font-medium mt-1">{userData.role}</p>
                  
                  <div className="flex flex-wrap justify-center mt-6 gap-4">
                    <Link 
                      to={`/e_editprofile/${userData.id}`}
                      className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <FaEdit className="mr-2" aria-hidden="true" />
                      Edit Profile
                    </Link>
                    
                    <button
                      onClick={handleDeleteAccount}
                      className="inline-flex items-center px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Delete account"
                    >
                      <MdDeleteForever className="mr-2" aria-hidden="true" />
                      Delete Account
                    </button>
                  </div>
                </div>
                
                {/* Profile information */}
                <div className="p-4 md:p-8 mt-4">
                  {/* Personal Info Section */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3 flex items-center">
                      <FaIdCard className="mr-2 text-blue-500" aria-hidden="true" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField icon={FaIdCard} label="Full Name" value={userData.fullName} />
                      <InfoField icon={FaEnvelope} label="Email Address" value={userData.email} />
                      <InfoField icon={FaPhone} label="Phone Number" value={userData.phone} />
                      <InfoField icon={FaUserTag} label="Role" value={userData.role} />
                    </div>
                  </div>
                  
                  {/* Security Section */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3 flex items-center">
                      <FaShieldAlt className="mr-2 text-blue-500" aria-hidden="true" />
                      Security Information
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <InfoField 
                        icon={FaShieldAlt} 
                        label="Password" 
                        value={userData.password} 
                        isPassword={true} 
                      />
                    </div>
                  </div>
                  
                  {/* Footer Section */}
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Last updated: {userData.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Euserprofile;
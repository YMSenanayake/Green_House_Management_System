import React, { useState, useEffect } from "react";
import axios from "axios";
import Adminnavbar from "./component/Adminnavbar";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { 
  UserCircle2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Save, 
  AlertCircle 
} from "lucide-react";

const Userupdate = () => {
  const { userid } = useParams();

  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    role: "User"
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Role options with descriptions
  const roleOptions = [
    { 
      value: "User", 
      label: "Standard User", 
      description: "Basic access to system features" 
    },
    { 
      value: "Employee manager", 
      label: "Employee Manager", 
      description: "Manages employee-related activities" 
    },
    { 
      value: "Tunnel manager", 
      label: "Tunnel Manager", 
      description: "Oversees tunnel operations" 
    },
    { 
      value: "Financial manager", 
      label: "Financial Manager", 
      description: "Manages financial processes" 
    },
    { 
      value: "Target manager", 
      label: "Target Manager", 
      description: "Tracks and manages organizational targets" 
    },
    { 
      value: "Courier service", 
      label: "Courier Service", 
      description: "Manages delivery and logistics" 
    },
    { 
      value: "Inventory manager", 
      label: "Inventory Manager", 
      description: "Handles inventory tracking" 
    },
    { 
      value: "Machine manager", 
      label: "Machine Manager", 
      description: "Oversees machinery and equipment" 
    }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:3000/api/users/getuser/${userid}`);
        const { user } = response.data;
        
        setUserData({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userid]);

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!userData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!userData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(userData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone to ensure only digits
    if (name === 'phone') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setUserData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Update user function
  const updateUser = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3000/api/users/updateuser/${userid}`,
        {
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        }
      );

      Swal.fire({
        title: "Profile Updated",
        text: "User information successfully updated",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Continue"
      }).then(() => {
        window.location.href = "/e_allusers";
      });
    } catch (error) {
      toast.error("Failed to update user profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render input field with icon and error handling
  const renderInputField = (name, label, icon, type = "text") => {
    const Icon = icon;
    return (
      <div className="mb-6 relative">
        <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center">
          <Icon className="mr-3 text-green-600" size={24} />
          <span className="text-base">{label}</span>
        </label>
        <div className="relative">
          <input
            type={type}
            name={name}
            value={userData[name]}
            onChange={handleInputChange}
            className={`
              w-full pl-5 pr-4 py-3.5 border-2 rounded-xl text-base
              focus:outline-none focus:ring-2 
              ${errors[name] 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
              }
            `}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {errors[name] && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <AlertCircle className="text-red-500" size={24} />
            </div>
          )}
        </div>
        {errors[name] && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="mr-2" size={16} />
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Original Navbar */}
      <Adminnavbar />
      
      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-8 ml-64">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
            <h1 className="text-4xl font-bold flex items-center justify-center space-x-4">
              <UserCircle2 size={44} />
              <span>Update User Profile</span>
            </h1>
          </div>

          {/* Form Content */}
          <form onSubmit={updateUser} className="p-12 space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Name Field */}
              {renderInputField('fullName', 'Full Name', UserCircle2)}

              {/* Email Field */}
              {renderInputField('email', 'Email Address', Mail, 'email')}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Phone Field */}
              {renderInputField('phone', 'Phone Number', Phone, 'tel')}

              {/* Role Dropdown */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center">
                  <ShieldCheck className="mr-3 text-green-600" size={24} />
                  <span className="text-base">User Role</span>
                </label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-4 rounded-xl 
                  bg-gradient-to-r from-green-600 to-blue-600 
                  text-white text-lg font-bold 
                  hover:opacity-90 transition-all 
                  flex items-center justify-center
                  disabled:opacity-50
                  shadow-lg hover:shadow-xl
                "
              >
                <Save className="mr-3" size={24} />
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Userupdate;
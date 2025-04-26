import React, { useState, useEffect } from "react";
import axios from "axios";
import AdprofileNavbar from "./component/AdprofileNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { 
  FaEye, FaEyeSlash, FaPencilAlt, FaSave, FaUser, FaEnvelope, 
  FaPhone, FaLock, FaArrowLeft, FaExclamationTriangle 
} from "react-icons/fa";
import Loader from "../../components/header/Loader";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 800,
  once: true,
});

const Edidemployeeprofile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    imageurl: ""
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  
  // Validation state
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear the error for this field when user types
    setErrors({
      ...errors,
      [name]: ""
    });
    
    // Special handling for phone field - only allow digits
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: phoneValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF)");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    if (!file) return formData.imageurl;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('http://localhost:3000/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:3000/api/users/getuser/${uid}`);
        
        if (response.data && response.data.user) {
          const userData = response.data.user;
          setFormData({
            id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            imageurl: userData.imageurl
          });
          setPreviewImage(userData.imageurl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [uid]);

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      password: ""
    };
    
    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Update user profile
  const updateUserProfile = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      // Scroll to the first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setFormLoading(true);
      
      // Handle image upload if there's a new image
      let finalImageUrl = formData.imageurl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      
      const updateUserData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        imageurl: finalImageUrl,
        password: formData.password,
      };

      await axios.put(
        `http://localhost:3000/api/users/updateuser/${uid}`,
        updateUserData
      );
      
      setFormLoading(false);
      
      // Show success message
      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#10B981"
      }).then(() => {
        navigate(`/e_userprofile/${uid}`);
      });
    } catch (error) {
      setFormLoading(false);
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  // Input field component
  const FormField = ({ 
    id, 
    label, 
    type = "text", 
    name, 
    value, 
    placeholder, 
    icon: Icon, 
    error,
    maxLength,
    onChange = handleInputChange
  }) => (
    <div className="relative">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label} {error && <span className="text-red-500 text-sm">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-green-500">
          <Icon aria-hidden="true" />
        </div>
        <input
          id={id}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          maxLength={maxLength}
          className={`w-full pl-10 pr-${type === "password" ? "12" : "4"} py-3 rounded-lg border ${
            error ? "border-red-400 bg-red-50" : "border-gray-300"
          } focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300`}
          placeholder={placeholder}
          onChange={onChange}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 text-gray-400 hover:text-green-600 focus:outline-none focus:text-green-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && (
        <p 
          id={`${id}-error`} 
          className="mt-1 text-sm text-red-500 flex items-center"
        >
          <FaExclamationTriangle className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex">
          <AdprofileNavbar />
          <div className="flex flex-col w-full" style={{ zIndex: 900 }}>
            <div data-aos="fade-up" className="w-full max-w-3xl mx-auto my-8 px-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header with back button */}
                <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4 flex items-center">
                  <Link 
                    to={`/e_userprofile/${uid}`}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition-all mr-3"
                    aria-label="Back to profile"
                  >
                    <FaArrowLeft className="text-white text-sm" />
                  </Link>
                  <h1 className="text-2xl font-bold">Edit Profile</h1>
                </div>
                
                <form onSubmit={updateUserProfile} className="p-6">
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                      <img
                        className="h-32 w-32 rounded-full object-cover border-4 border-green-100 shadow-md"
                        src={previewImage || "https://via.placeholder.com/150"}
                        alt="Profile"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-md transition-all duration-300 ease-in-out transform hover:scale-110"
                        aria-label="Change profile picture"
                      >
                        <FaPencilAlt className="h-4 w-4" />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/jpeg, image/png, image/jpg, image/gif"
                        className="hidden"
                        onChange={handleImageChange}
                        aria-label="Upload profile picture"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Click the pencil icon to change your profile picture
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats: JPEG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-6">
                    <FormField
                      id="fullName"
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      placeholder="Enter your full name"
                      icon={FaUser}
                      error={errors.fullName}
                    />
                    
                    <FormField
                      id="email"
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      placeholder="Enter your email"
                      icon={FaEnvelope}
                      error={errors.email}
                    />
                    
                    <FormField
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      placeholder="Enter your 10-digit phone number"
                      maxLength={10}
                      icon={FaPhone}
                      error={errors.phone}
                    />
                    
                    <FormField
                      id="password"
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      placeholder="Enter your password"
                      icon={FaLock}
                      error={errors.password}
                    />
                  </div>
                  
                  {/* Form Actions */}
                  <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-between gap-4">
                    <Link
                      to={`/e_userprofile/${uid}`}
                      className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-3 px-8 rounded-full shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow order-2 sm:order-1 w-full sm:w-auto"
                    >
                      <FaArrowLeft className="h-4 w-4" />
                      <span>Cancel</span>
                    </Link>
                    
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none order-1 sm:order-2 w-full sm:w-auto"
                    >
                      {formLoading ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaSave className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Instructions card */}
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2" /> Profile Update Tips
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use a professional photo for your profile picture</li>
                  <li>Ensure your contact information is up to date</li>
                  <li>Choose a strong password for better security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edidemployeeprofile;
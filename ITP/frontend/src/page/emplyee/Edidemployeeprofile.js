import React, { useState, useEffect } from "react";
import axios from "axios";
import AdprofileNavbar from "./component/AdprofileNavbar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaPencilAlt, FaSave, FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from "react-icons/fa";
import Loader from "../../components/header/Loader";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 800, // Slightly reduced animation duration for better UX
});

const Edidemployeeprofile = () => {
  const { uid } = useParams("");

  const [id, setid] = useState("");
  const [fullName, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility_1 = () => {
    setShowPasswords((prevShowPasswords) => !prevShowPasswords);
  };

  const togglePasswordVisibility_2 = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Image selected successfully");
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    if (!file) return imageurl;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post('http://localhost:3000/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl; // assuming your API returns the image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
      return imageurl; // fallback to existing image
    }
  };

  //take data for update
  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const response = (
          await axios.post(`http://localhost:3000/api/users/getuser/${uid}`)
        ).data;
        setLoading(false);
        console.log(response.user);
        setid(response.user._id);
        setname(response.user.fullName);
        setemail(response.user.email);
        setphone(response.user.phone);
        setPassword(response.user.password);
        setimageurl(response.user.imageurl);
        setPreviewImage(response.user.imageurl);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching user data:", error.response || error);
        toast.error("Failed to load user data");
      }
    }
    getUser();
  }, [uid]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
      newErrors.fullName = "Name can only contain letters and spaces";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //updateuser function
  async function Updateuser(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setFormLoading(true);
      
      // Handle image upload if there's a new image
      let finalImageUrl = imageurl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      
      const updateuser = {
        fullName,
        email,
        phone,
        imageurl: finalImageUrl,
        password,
      };

      const response = (
        await axios.put(
          `http://localhost:3000/api/users/updateuser/${uid}`,
          updateuser
        )
      ).data;
      
      console.log("Update response:", response);
      setFormLoading(false);
      
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#10B981"
      }).then(() => {
        window.location.href = `/e_userprofile/${uid}`;
      });
    } catch (error) {
      setFormLoading(false);
      console.log("Update error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex">
          {/* Keep the original navbar exactly as it was */}
          <AdprofileNavbar />
          
          {/* Content area */}
          <div className="flex-1">
            {/* Back Button */}
            <div className="px-6 pt-6">
              <Link 
                to={`/e_userprofile/${uid}`}
                className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-300"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back to Profile</span>
              </Link>
            </div>
            
            <div data-aos="fade-up" className="w-full max-w-3xl mx-auto my-6 px-4">
              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6">
                  <h1 className="text-2xl font-bold text-center">Edit Your Profile</h1>
                  <p className="text-center text-green-100 mt-2">Update your personal information</p>
                </div>
                
                <form onSubmit={Updateuser} className="p-6 md:p-8">
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4 group">
                      <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-green-100 shadow-md transition-transform duration-300 group-hover:scale-105">
                        <img
                          className="h-full w-full object-cover"
                          src={previewImage || imageurl || "https://via.placeholder.com/150"}
                          alt="Profile"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <label
                        htmlFor="file-upload"
                        className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full cursor-pointer shadow-md transition-all duration-300 ease-in-out transform hover:scale-110"
                      >
                        <FaPencilAlt className="h-4 w-4" />
                        <span className="sr-only">Change profile picture</span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Click the icon to update your profile picture</p>
                    {imageFile && (
                      <p className="text-xs text-green-600 mt-1">New image selected: {imageFile.name}</p>
                    )}
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div className="relative">
                      <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-green-500">
                          <FaUser />
                        </div>
                        <input
                          type="text"
                          value={fullName}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300`}
                          placeholder="Enter your full name"
                          onChange={(e) => {
                            setname(e.target.value);
                            if (errors.fullName) {
                              setErrors({...errors, fullName: null});
                            }
                          }}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    
                    {/* Email Field */}
                    <div className="relative">
                      <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-green-500">
                          <FaEnvelope />
                        </div>
                        <input
                          type="email"
                          value={email}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300`}
                          placeholder="Enter your email"
                          onChange={(e) => {
                            setemail(e.target.value);
                            if (errors.email) {
                              setErrors({...errors, email: null});
                            }
                          }}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    {/* Phone Field */}
                    <div className="relative">
                      <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-green-500">
                          <FaPhone />
                        </div>
                        <input
                          type="text"
                          maxLength={10}
                          value={phone}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300`}
                          placeholder="Enter your 10-digit phone number"
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '');
                            setphone(value);
                            if (errors.phone) {
                              setErrors({...errors, phone: null});
                            }
                          }}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    
                    {/* Password Field */}
                    <div className="relative">
                      <label className="block text-gray-700 font-medium mb-2">Password</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-green-500">
                          <FaLock />
                        </div>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={password}
                          className={`w-full pl-10 pr-12 py-3 rounded-lg border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300`}
                          placeholder="Enter your password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                              setErrors({...errors, password: null});
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility_1}
                          className="absolute right-3 top-3 text-gray-400 hover:text-green-600 focus:outline-none"
                          aria-label={showPasswords ? "Hide password" : "Show password"}
                        >
                          {showPasswords ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Password should be at least 6 characters long</p>
                    </div>
                  </div>
                  
                  {/* Submit and Cancel Buttons */}
                  <div className="mt-8 flex justify-center gap-4">
                    <Link
                      to={`/e_userprofile/${uid}`}
                      className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-all duration-300 ease-in-out"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formLoading ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaSave />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Tips Section */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-100">
                <h3 className="text-green-600 font-medium mb-2">Profile Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use a clear, professional photo for your profile picture</li>
                  <li>• Ensure your email address is current and accessible</li>
                  <li>• Keep your contact information up to date</li>
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
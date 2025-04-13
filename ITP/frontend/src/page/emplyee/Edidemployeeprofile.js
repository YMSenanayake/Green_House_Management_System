import React, { useState, useEffect } from "react";
import axios from "axios";
import AdprofileNavbar from "./component/AdprofileNavbar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaPencilAlt, FaSave, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import Loader from "../../components/header/Loader";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000, // Slightly reduced animation duration for better UX
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

  //updateuser function
  async function Updateuser(e) {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Phone validation - ensure it's 10 digits
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
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
      
      Swal.fire(
        "Congratulations",
        "Profile updated successfully",
        "success"
      ).then(() => {
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
        <>
          <div className="flex">
            <AdprofileNavbar />
            <div className="flex flex-col w-full" style={{ zIndex: 900 }}>
              <div data-aos="fade-up" className="w-full max-w-3xl mx-auto my-8 px-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4">
                    <h1 className="text-2xl font-bold text-center">Edit Profile</h1>
                  </div>
                  
                  <form onSubmit={Updateuser} className="p-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mb-8">
                      <div className="relative mb-4">
                        <img
                          className="h-32 w-32 rounded-full object-cover border-4 border-green-100 shadow-md"
                          src={previewImage || imageurl || "https://via.placeholder.com/150"}
                          alt="Profile"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <label
                          htmlFor="file-upload"
                          className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-md transition-all duration-300 ease-in-out transform hover:scale-110"
                        >
                          <FaPencilAlt className="h-4 w-4" />
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Click the pencil icon to change your profile picture</p>
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
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                            placeholder="Enter your full name"
                            onChange={(e) => setname(e.target.value)}
                          />
                        </div>
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
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                            placeholder="Enter your email"
                            onChange={(e) => setemail(e.target.value)}
                          />
                        </div>
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
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                            placeholder="Enter your 10-digit phone number"
                            onChange={(e) => {
                              // Only allow digits
                              const value = e.target.value.replace(/\D/g, '');
                              setphone(value);
                            }}
                          />
                        </div>
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
                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility_1}
                            className="absolute right-3 top-3 text-gray-400 hover:text-green-600 focus:outline-none"
                          >
                            {showPasswords ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Edidemployeeprofile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdprofileNavbar from "./component/AdprofileNavbar";
import { FaEdit, FaEye, FaEyeSlash, FaIdCard, FaEnvelope, FaPhone, FaUserTag } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loader from "../../components/header/Loader";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000,
});

function Euserprofile() {
  const user = JSON.parse(localStorage.getItem("currentuser"));
  const { empid } = useParams("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [id, setid] = useState("");
  const [fullName, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const response = (
          await axios.post(`http://localhost:3000/api/users/getuser/${empid}`)
        ).data;
        setLoading(false);
        console.log(response.user);
        setid(response.user._id);
        setname(response.user.fullName);
        setemail(response.user.email);
        setphone(response.user.phone);
        setimageurl(response.user.imageurl);
        setPassword(response.user.password);
      } catch (error) {
        setLoading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load profile data. Please try again later."
        });
      }
    }
    getUser();
  }, [empid]);

  const deleteuser = async (id) => {
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
        await axios.delete(`http://localhost:3000/api/users/delete/${id}`);
        setLoading(false);
        
        Swal.fire({
          icon: "success",
          title: "Account Deleted",
          text: "Your account has been successfully deleted.",
          timer: 2000,
          showConfirmButton: false
        });
        
        // Brief timeout to allow the user to see the success message
        setTimeout(() => {
          localStorage.removeItem("currentuser");
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete account. Please try again later."
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const fetchData = async () => {
    if (!user) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Information card component for better organization
  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="mb-5">
      <label className="mb-3 block text-base font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center w-full rounded-md border border-gray-200 bg-white py-3 px-4 text-gray-700">
        <Icon className="mr-3 text-gray-500" />
        <input
          className="w-full bg-white outline-none border-none focus:ring-0"
          value={value}
          readOnly
        />
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
            <div className="max-w-3xl mx-auto w-full" data-aos="fade-up">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Profile header with background */}
                <div className="relative">
                  <div className="h-40 overflow-hidden">
                    <img
                      className="w-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60"
                      alt="Profile background"
                    />
                  </div>
                  
                  {/* Profile image */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                    <div className="w-32 h-32 relative border-4 border-white rounded-full overflow-hidden shadow-md">
                      <img
                        className="object-cover object-center h-full w-full"
                        src={user.imageurl || "https://via.placeholder.com/150"}
                        alt={`${user.fullName}'s profile`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Profile actions */}
                <div className="mt-20 text-center px-6">
                  <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                  <p className="text-gray-600 font-medium mt-1">{user.role}</p>
                  
                  <div className="flex justify-center mt-4 space-x-4">
                    <Link 
                      to={`/e_editprofile/${user._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </Link>
                    
                    <button
                      onClick={() => deleteuser(user._id)}
                      className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-300"
                    >
                      <MdDeleteForever className="mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
                
                {/* Profile information */}
                <div className="p-6 mt-4">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField icon={FaIdCard} label="Full Name" value={fullName} />
                      <InfoField icon={FaEnvelope} label="Email Address" value={email} />
                      <InfoField icon={FaPhone} label="Phone Number" value={phone} />
                      <InfoField icon={FaUserTag} label="Role" value={user.role} />
                      
                      <div className="mb-5 md:col-span-2">
                        <label className="mb-3 block text-base font-medium text-gray-700">
                          Password
                        </label>
                        <div className="relative flex items-center w-full rounded-md border border-gray-200 bg-white py-3 px-4">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-white outline-none border-none focus:ring-0"
                            value={password}
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-lg" />
                            ) : (
                              <FaEye className="text-lg" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
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
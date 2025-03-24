import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import loginSignupImage from "../register/login-animation.gif";
import backgroundImage from "../login/background.jpg";
import logoImage from "../login/logo.png";

function RegisterForm() {
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [imageurl, setImageUrl] = useState(loginSignupImage);
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const navigate = useNavigate();

  const handleUploadProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigateToSignIn = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/signin");
    }, 500);
  };

  async function register(event) {
    event.preventDefault();

    if (password !== cpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (phone.length < 10) {
      toast.error("Phone number must be at least 10 digits.");
      return;
    }

    const user = { fullName, email, phone, password, imageurl };

    setLoading(true);
    try {
      const result = await axios.post("http://localhost:3000/api/users/register", user);
      setLoading(false);
      if (result.data.success) {
        toast.success(result.data.message);
        handleNavigateToSignIn();
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-sm" />

      {/* Top-left floating logo */}
      <img
        src={logoImage}
        alt="Logo"
        className="absolute top-10 left-10 w-24 h-24 rounded-full shadow-xl border-4 border-white/40 z-20 bg-white/70 backdrop-blur-sm p-1"
      />

      <AnimatePresence>
        <motion.div
          key="register"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20"
        >
          <h2 className="text-3xl font-semibold text-center text-white mb-6">Register</h2>

          <form onSubmit={register} className="space-y-5">
            {/* Profile Image Upload */}
            <div className="text-center">
              <div className="relative mx-auto w-28 h-28">
                <img
                  src={imageurl}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full border-4 border-white/30 shadow-md"
                />
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-white/20 text-white text-sm px-3 py-1 rounded-full cursor-pointer backdrop-blur-md"
                >
                  Upload
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadProfileImage}
                />
              </div>
            </div>

            <input
              type="text"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg outline-none focus:ring-2 focus:ring-white"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg outline-none focus:ring-2 focus:ring-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg outline-none focus:ring-2 focus:ring-white"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg outline-none focus:ring-2 focus:ring-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg outline-none focus:ring-2 focus:ring-white"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6 text-white/80 text-sm">
            Already have an account?{" "}
            <span
              onClick={handleNavigateToSignIn}
              className="text-white font-medium underline hover:text-white/90 cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default RegisterForm;

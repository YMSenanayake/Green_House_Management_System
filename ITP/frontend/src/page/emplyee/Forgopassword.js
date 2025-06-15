import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from "../../components/header/Loader";
import bgimg1 from '../emplyee/image/bgimg1.png';
import Swal from "sweetalert2";
import { FiMail, FiLock } from 'react-icons/fi';
import { RiArrowLeftLine } from 'react-icons/ri';

AOS.init({
  duration: 1000,
});

function Forgopassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(false);
    // Focus email input on component mount
    document.getElementById('email')?.focus();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setEmailError('');
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
  
    try {
      setLoading(true);
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:3000/api/resetpassword/forgot-password', { email });
      setLoading(false);
      setIsSubmitting(false);
      Swal.fire({
        icon: 'success',
        title: 'Email Sent',
        text: 'Password reset instructions have been sent to your email',
        confirmButtonColor: '#65a30d',
      });
    } catch (error) {
      setLoading(false);
      setIsSubmitting(false);
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Account Not Found',
          text: 'No account exists with this email address',
          confirmButtonColor: '#65a30d',
        });
      } else {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong',
          text: 'Unable to process your request at this time. Please try again later.',
          confirmButtonColor: '#65a30d',
        });
      }
    }
  };
  
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div
          data-aos="fade-in"
          className="flex flex-col justify-center items-center bg-zinc-800 min-h-screen"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgimg1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {/* Navigation buttons */}
          <div className="absolute top-0 left-0 m-6">
            <Link to="/signin" className="flex items-center text-white hover:text-lime-400 transition-colors duration-300">
              <RiArrowLeftLine className="mr-2 text-xl" />
              <span className="font-medium">Back to Login</span>
            </Link>
          </div>
          
          <div className="absolute top-0 right-0 m-6 flex gap-4">
            <Link to="/signup">
              <button className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Sign Up
              </button>
            </Link>
          </div>
          
          <div className="overflow-hidden w-full max-w-screen-lg mx-auto px-4">
            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-0">
              {/* Logo and intro section */}
              <div className="w-full md:w-3/5 text-center md:text-left text-white p-6">
              
                <h1 className="text-4xl md:text-5xl font-bold mb-4 shadow-text">
                  Reset Your Password
                </h1>
                <p className="text-lg mb-6 max-w-md mx-auto md:mx-0 opacity-90">
                  We'll help you get back into your account quickly and securely.
                </p>
              </div>
              
              {/* Form section */}
              <div className="w-full md:w-2/5">
                <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 mb-5 bg-lime-100 rounded-full flex items-center justify-center">
                      <FiLock className="text-lime-600 text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3">Forgot Password?</h2>
                    <p className="text-gray-600 text-md">No worries! Enter your email and we'll send you a reset link</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          className={`w-full pl-10 pr-4 py-3 bg-stone-50 rounded-lg border ${
                            emailError ? 'border-red-500' : 'border-gray-200'
                          } focus:ring-2 focus:ring-lime-600 focus:border-lime-600 focus:ring-opacity-30 outline-none transition-all duration-300`}
                          type="email"
                          placeholder="your-email@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          required
                          autoComplete="email"
                        />
                      </div>
                      {emailError && (
                        <p className="mt-2 text-sm text-red-600 ml-1 flex items-center">
                          <span className="mr-1">⚠️</span> {emailError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3 mt-4 text-white bg-lime-600 rounded-lg font-semibold tracking-wide transition duration-300 hover:bg-lime-700 focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 shadow-md ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-1'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                    
                    <div className="text-center mt-4">
                      <Link to="/signin" className="flex items-center justify-center text-lime-600 hover:text-lime-800 text-sm font-medium transition-colors duration-300">
                        Remember your password? <span className="underline ml-1">Sign in</span>
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="absolute bottom-4 text-center text-white text-sm opacity-80">
            <p>© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .shadow-text {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

export default Forgopassword;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link} from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // ✅ Import motion
import backgroundImage from "./background.jpg";
import logo from "./logo.png";

function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userCredentials = {email, password};

        try{
            const result = await axios.post("http://localhost:3000/api/users/login", userCredentials);
            setLoading(false);
            
            if(result.data.success){
                localStorage.setItem("currentuser", JSON.stringify(result.data.user));
                localStorage.setItem("user:detail", JSON.stringify(result.data.user));

                const role = result.data.user.role;

                switch(role){
                    case "User":
                        navigate("/Allusers");
                        break;
                    case "Employee manager":
                        navigate("/employeeDashboard");
                        break;
                    case "Tunnel manager":
                        navigate("/tunneldashboard");
                        break;     
                    case "Courior servise":
                        navigate("/curiorservisedashboard");
                        break;
                    case "Target manager":
                        navigate("/targetsdashboard");
                        break;
                    case "Inventory manager":
                        navigate("/inventorydasgboard");
                        break;
                    case "Financial manager":
                        navigate("/Financialdashboard");
                        break;
                    case "Machine manager":
                        navigate("/machinedashboard");   
                        break; 
                        default:
                            console.error("Unsupported role:", role);
                            toast.error("Unsupported user role.");
                }
            } else {
              toast.error("Login failed. Please check your credentials.");
            }
        }catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Invalid credentials or server error.");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0 "
          />
    
          {/* Logo */}
          <a href="/">
          <img
            src={logo}
            alt="Logo"
            className="absolute top-12 left-20 w-24 h-24 rounded-full shadow-xl border-4 border-white/40 z-20 bg-white/70 backdrop-blur-sm p-1"
          />
          </a>
          
    
          {/* ✅ Animated Login Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20"
          >
            <h2 className="text-3xl font-semibold text-center text-white mb-8">Login</h2>
    
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/80 rounded-lg outline-none focus:ring-2 focus:ring-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
    
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/80 rounded-lg outline-none focus:ring-2 focus:ring-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
    
              <button
                type="submit"
                className="w-full py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
    
            <p className="text-center mt-6 text-white/80 text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-white font-medium underline hover:text-white/90">
                Create Account
              </Link>
            </p>
          </motion.div>
        </div>
      );
}

export default LoginForm;

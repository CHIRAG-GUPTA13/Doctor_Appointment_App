import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/v1/public/admin/login", {
        email,
        password,
      });
      const token = response.data.obj.token;
      Cookies.set("jwt", token, { expires: 1, secure: true, sameSite: "Strict" });
      toast.success("Login Successful!");
      setTimeout(() => navigate("/adminDashboard"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form 
          className="bg-white shadow-xl rounded-3xl p-8 space-y-6 border border-indigo-50"
          onSubmit={onSubmitHandler}
        >
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <MdAdminPanelSettings className="text-5xl text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-500">Sign in to manage the system</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaUserShield className="mr-2" />
                Sign In
              </span>
            )}
          </button>

          <div className="text-center text-sm text-gray-600 pt-2">
            <p>
              Doctor?{' '}
              <button 
                type="button"
                onClick={() => navigate("/DoctorLogin")}
                className="text-indigo-600 font-medium hover:underline focus:outline-none"
              >
                Switch to Doctor Login
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

function Login({ onLoginSuccess }) {
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValidPassword = (password) => {
    return password.length >= 8 && /\d/.test(password);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (state === "Sign Up") {
      if (!isValidPassword(formData.password)) {
        toast.error("Password must be at least 8 characters with one number");
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        state === "Sign Up" 
          ? "http://localhost:8080/api/v1/public/patient/create"
          : "http://localhost:8080/api/v1/public/patient/login",
        state === "Sign Up" ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber || "9601041032",
        } : {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data.obj.token;
      Cookies.set("jwt", token, { 
        expires: 1, 
        secure: true, 
        sameSite: "Strict",
        path: "/"
      });

      toast.success(state === "Sign Up" ? "Account created successfully!" : "Login successful!");
      
      // Call the parent callback to update navbar state
      if (onLoginSuccess) {
        onLoginSuccess(token); // Pass the token to fetch profile image immediately
      }
      
      navigate("/");
      
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              {state === "Sign Up" ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-blue-100 mt-1">
              {state === "Sign Up" ? "Join us to book appointments easily" : "Login to manage your health"}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="p-6">
            {state === "Sign Up" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="text"
                      name="firstName"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="text"
                      name="lastName"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-blue-400" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-blue-400" />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder={state === "Sign Up" ? "At least 8 characters with a number" : "Your password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {state === "Sign Up" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="+91 1234567890"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} flex items-center justify-center`}
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  {state === "Sign Up" ? 'Create Account' : 'Login'}
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
                  className="text-blue-600 font-medium hover:underline focus:outline-none"
                >
                  {state === "Sign Up" ? "Login here" : "Sign up"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
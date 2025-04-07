import { forwardRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { 
  FaUserCircle, 
  FaChevronDown, 
  FaTimes, 
  FaBars, 
  FaUser, 
  FaCalendarAlt, 
  FaSignOutAlt,
  FaUserShield
} from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check auth status and fetch profile image
  const checkAuthStatus = async (token = null) => {
    const jwtToken = token || Cookies.get("jwt");
    setIsLoggedIn(!!jwtToken);
    
    if (jwtToken) {
      await fetchProfileImage(jwtToken);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };

  const fetchProfileImage = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/images/download/image", {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob"
      });
      
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setProfileImage(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove("jwt", { path: "/" });
    setIsLoggedIn(false);
    setProfileImage(null);
    setShowDropdown(false);
    navigate("/");
  };

  useEffect(() => {
    checkAuthStatus();
    setIsLoggedIn(false);
  }, []);

  // Expose the handleLoginSuccess method via ref
  useEffect(() => {
    if (ref) {
      ref.current = {
        handleLoginSuccess: (token) => {
          checkAuthStatus(token);
        }
      };
    }
  }, [ref]);

  return (
    <nav className="bg-white shadow-sm py-3 px-6 sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")} 
          className="flex items-center cursor-pointer"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            CareConnect
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/doctor" 
            className={({ isActive }) => 
              `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''}`
            }
          >
            Doctors
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''}`
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''}`
            }
          >
            Contact
          </NavLink>

          {/* Admin Portal Button (only visible when not logged in) */}
          {!isLoading && !isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/adminLogin")}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
            >
              <FaUserShield className="text-lg" />
              <span>Admin Portal</span>
            </motion.button>
          )}

          {/* Auth Buttons */}
          {isLoading ? (
            <div className="w-28 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          ) : isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-full h-full text-blue-400" />
                  )}
                </div>
                <FaChevronDown className={`text-gray-500 transition-transform ${showDropdown ? 'transform rotate-180' : ''}`} />
              </button>

              {/* Enhanced Dropdown Menu */}
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {profileImage ? "My Account" : "Welcome!"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/my-profile");
                        setShowDropdown(false);
                      }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition"
                    >
                      <FaUser className="mr-3 text-gray-500" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/patient-appointments");
                        setShowDropdown(false);
                      }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition"
                    >
                      <FaCalendarAlt className="mr-3 text-gray-500" />
                      <span>My Appointments</span>
                    </button>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition"
                    >
                      <FaSignOutAlt className="mr-3 text-gray-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition"
            >
              Create Account
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)} 
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {showMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white py-4 px-6 shadow-md absolute top-16 left-0 right-0 z-10 border-t border-gray-100"
        >
          <div className="flex flex-col space-y-4">
            <NavLink 
              to="/" 
              onClick={() => setShowMenu(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </NavLink>
            <NavLink 
              to="/doctor" 
              onClick={() => setShowMenu(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Doctors
            </NavLink>
            <NavLink 
              to="/about" 
              onClick={() => setShowMenu(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={() => setShowMenu(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Contact
            </NavLink>

            {/* Admin Portal in mobile menu */}
            {!isLoading && !isLoggedIn && (
              <button
                onClick={() => {
                  navigate("/adminLogin");
                  setShowMenu(false);
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition"
              >
                <FaUserShield className="mr-3" />
                Admin Portal
              </button>
            )}

            {isLoading ? null : isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    navigate("/my-profile");
                    setShowMenu(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  <FaUser className="mr-3" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/patient-appointments");
                    setShowMenu(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  <FaCalendarAlt className="mr-3" />
                  My Appointments
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition mt-2"
              >
                Create Account
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
});

export default Navbar;
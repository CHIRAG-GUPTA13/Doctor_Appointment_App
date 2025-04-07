import { assets } from "../assets/assets";
import { useState } from "react";
import { motion } from "framer-motion";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-[#5f6FFF] rounded-lg px-6 md:px-10 lg:px-20">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 m-auto md:py-[8vw] md:mb-0"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm"
        >
          <i className="fas fa-hospital-alt mr-2"></i>
          Your Health, Our Priority
        </motion.div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold leading-tight font-poppins">
          <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-white animate-[typing_3s_steps(40,end)_forwards] ">
            Find and Book Your 
          </span>
          <br />
          <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-white animate-[typing_3s_steps(40,end)_forwards] ">
            Perfect Doctor
          </span>
        </h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center gap-4 text-white/90 text-lg"
        >
          <img
            className="w-32"
            src={assets.group_profiles}
            alt="Doctor profiles"
          />
          <p className="leading-relaxed">
            Browse through our extensive list of trusted doctors and schedule
            your appointment today.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col gap-4 w-full"
        >
          <div className="relative w-full">
            <div
              className={`absolute inset-0 bg-white/10 rounded-2xl blur transition-all duration-300 ${
                isSearchFocused ? "opacity-100" : "opacity-0"
              }`}
            ></div>
            <div className="relative w-[420px]">
              <input
                type="text"
                name="doctor-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search doctors, specialties..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button
                onClick={() => console.log("Search for:", searchTerm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
              >
                <span>Search</span>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <a
            href="#speciality"
            className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-full w-[230px] text-blue-600 font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Book Appointment
            <i className="fas fa-arrow-right"></i>
          </a>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 relative mt-8 md:mt-0"
      >
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-2xl shadow-xl"
          src={assets.header_img}
          alt="Doctor consultation"
        />
      </motion.div>
    </div>
  );
}

export default Header;
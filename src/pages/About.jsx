import { assets } from "../assets/assets"
import { motion } from "framer-motion"

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          About <span className="text-[#5f6FFF]">Us</span>
        </h1>
        <div className="w-20 h-1 bg-[#5f6FFF] mx-auto mt-3 rounded-full"></div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row items-center gap-12 mb-20"
      >
        <div className="md:w-1/2">
          <img 
            className="w-3/4 mx-auto rounded-xl shadow-xl hover:scale-105 transition-transform duration-500"
            src={assets.about_image} 
            alt="About Prescripto" 
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Care Connect, your trusted healthcare partner
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Care Connect is committed to excellence in healthcare technology. We continuously strive to improve our services and provide the best possible experience for our customers.
          </p>
          <div className="pt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Our vision at Care Connect is to create a seamless healthcare experience for everyone, making quality healthcare accessible and convenient through innovative technology.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900">
          Why <span className="text-[#5f6FFF]">Choose Us</span>
        </h2>
        <div className="w-20 h-1 bg-[#5f6FFF] mx-auto mt-3 rounded-full"></div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
      >
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div className="bg-[#5f6FFF]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#5f6FFF] transition-colors duration-300">
            <i className="fas fa-clock text-xl text-[#5f6FFF] group-hover:text-white"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Efficiency</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Streamlined appointment scheduling that fits into your busy lifestyle, saving you time and effort.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div className="bg-[#5f6FFF]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#5f6FFF] transition-colors duration-300">
            <i className="fas fa-stethoscope text-xl text-[#5f6FFF] group-hover:text-white"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Convenience</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Access to a network of trusted healthcare professionals in your area, all at your fingertips.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div className="bg-[#5f6FFF]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#5f6FFF] transition-colors duration-300">
            <i className="fas fa-user-check text-xl text-[#5f6FFF] group-hover:text-white"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Personalization</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tailored recommendations and reminders to help you stay on top of your health journey.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default About
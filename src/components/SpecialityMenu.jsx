import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaStethoscope, FaArrowRight } from "react-icons/fa";

function SpecialityMenu() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [0, 1]);
  const y = useTransform(scrollY, [0, 200], [100, 0]);

  return (
    <motion.section 
      style={{ opacity, y }}
      className="relative py-20 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white overflow-hidden"
      id="speciality"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 -right-20 w-72 h-72 bg-teal-100 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <FaStethoscope className="text-blue-600 text-xl" />
            </div>
            <span className="text-blue-600 font-medium tracking-wider">MEDICAL SPECIALITIES</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-4"
          >
            Find by Speciality
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed"
          >
            Connect with specialized doctors who provide exceptional care tailored to your health needs.
          </motion.p>
        </div>

        {/* Speciality List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-4"
        >
          {specialityData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link 
                to={`/doctor/${item.speciality}`} 
                onClick={() => window.scrollTo(0, 0)}
                className="block"
              >
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50 border border-gray-100">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-300"></div>
                    <img 
                      className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md z-10 relative transition-transform duration-300 group-hover:scale-110" 
                      src={item.image} 
                      alt={item.speciality} 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{item.speciality}</h3>
                  <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">View Doctors</span>
                    <FaArrowRight className="ml-1 text-xs" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            to="/doctor"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>View All Specialities</span>
            <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default SpecialityMenu;
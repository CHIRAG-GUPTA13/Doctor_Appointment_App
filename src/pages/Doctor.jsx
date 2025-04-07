import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

function Doctor() {
  const { speciality } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/doctor/all");
        const data = await response.json();

        if (data.obj && data.obj.doctors && Array.isArray(data.obj.doctors)) {
          const extractedDoctors = data.obj.doctors.map((doctorObj) => ({
            ...doctorObj.doctor,
            image: doctorObj.image,
          }));
          setDoctors(extractedDoctors);
        } else {
          console.error("API returned unexpected data:", data);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!Array.isArray(doctors)) return;

    let filtered = doctors;
    
    if (speciality) {
      filtered = filtered.filter(doc => doc.specialization === speciality);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilterDoc(filtered);
  }, [doctors, speciality, searchTerm]);

  const specialties = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {speciality ? `${speciality}s` : "Our Specialist Doctors"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with experienced healthcare professionals for personalized care
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              className="w-full py-3 px-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64">
            <button
              className={`w-full mb-4 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 lg:hidden flex items-center justify-center
                ${showFilter ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200"}`}
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {showFilter ? "Hide Filters" : "Show Filters"}
            </button>

            <motion.div
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${showFilter ? "block" : "hidden lg:block"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Specializations</h3>
              <div className="space-y-2">
                <div
                  onClick={() => navigate("/doctor")}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex items-center
                    ${!speciality 
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  All Specialties
                </div>
                {specialties.map((spec) => (
                  <div
                    key={spec}
                    onClick={() => (speciality === spec ? navigate("/doctor") : navigate(`/doctor/${spec}`))}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex items-center
                      ${speciality === spec
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 1 1 0 001.415 1.414z" clipRule="evenodd" />
                    </svg>
                    {spec}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Doctors Grid */}
          <div className="flex-1">
            {filterDoc.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filterDoc.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                    onClick={() => {
                      if (item.available) {
                        navigate(`/appointment/${item.id}`);
                      } else {
                        alert("This doctor is currently not available for appointments");
                      }
                    }}
                  >
                    <div className="relative h-60 bg-gradient-to-r from-blue-50 to-gray-50 flex items-center justify-center">
                      <img
                        className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt={`${item.firstName} ${item.lastName}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://img.icons8.com/ios-filled/100/000000/doctor-male.png";
                        }}
                      />
                      {item.available && (
                        <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Available
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Dr. {item.firstName} {item.lastName}
                        </h3>
                        {!item.available && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium mb-4">{item.specialization || "General Physician"}</p>
                      
                      <button 
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300
                          ${item.available 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                        disabled={!item.available}
                      >
                        {item.available ? "Book Appointment" : "Not Available"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `No doctors match your search for "${searchTerm}"`
                    : "Currently there are no doctors available in this specialty"}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    navigate("/doctor");
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View All Doctors
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doctor;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AllDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [filterDoc, setFilterDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/v1/users/doctor/all");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.obj && data.obj.doctors && Array.isArray(data.obj.doctors)) {
          const extractedDoctors = data.obj.doctors.map((doctorObj) => ({
            ...doctorObj.doctor,
            image: doctorObj.image,
          }));
          setDoctors(extractedDoctors);
          setFilterDoc(extractedDoctors);
        } else {
          setError("Unexpected data format from API");
          setDoctors([]);
          setFilterDoc([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.message);
        setDoctors([]);
        setFilterDoc([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleAvailabilityToggle = async (doctorId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/doctor/available/toggle/${doctorId}`,
        { method: "PUT" }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
  
      if (typeof data.obj === "boolean") {
        setDoctors(prevDoctors =>
          prevDoctors.map(doctor =>
            doctor.id === doctorId ? { ...doctor, available: data.obj } : doctor
          )
        );
        setFilterDoc(prevFilterDoc =>
          prevFilterDoc.map(doctor =>
            doctor.id === doctorId ? { ...doctor, available: data.obj } : doctor
          )
        );
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      alert("Failed to update availability. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading doctors</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Doctor Management</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage doctor availability and view profiles
        </p>
      </motion.div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterDoc.length > 0 ? (
          filterDoc.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              {/* Doctor Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={`${item.firstName} ${item.lastName}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x300?text=Doctor";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Dr. {item.firstName} {item.lastName}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      {item.specialization || "General Physician"}
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.available || false}
                      onChange={() => handleAvailabilityToggle(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {item.available ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => navigate(`/adminDoctorProfile/${item.id}`)}
                  className="w-full mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  View Full Profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">No doctors found</h3>
            <p className="text-gray-500 text-sm">There are currently no doctors registered in the system</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AllDoctor;
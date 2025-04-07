import { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

function DoctorProfile() {
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    specialization: "",
    doctor_fees: "",
    total_points: "",
    about: "",
    experience: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(assets.default_image);
  const [loading, setLoading] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("jwt");
  
        // Fetch user data
        const userResponse = await axios.get(
          "http://localhost:8080/api/v1/users/doctor/get",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (userResponse.data?.obj) {
          setUserData(prev => ({
            ...prev,
            ...userResponse.data.obj,
            image: null
          }));
        }
  
        // Fetch image
        try {
          const imageResponse = await axios.get(
            "http://localhost:8080/api/v1/images/download/image",
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob"
            }
          );
          
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setHasUploadedImage(true);
          setUserData(prev => ({ ...prev, image: imageUrl }));
        } catch (imageError) {
          console.log("No profile image found");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = Cookies.get("jwt");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = hasUploadedImage 
        ? "http://localhost:8080/api/v1/images/update/image"
        : "http://localhost:8080/api/v1/images/upload";
      
      const method = hasUploadedImage ? "put" : "post";

      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update image preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setUserData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      
      setHasUploadedImage(true);
    } catch (error) {
      setError("Failed to update profile image");
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("jwt");
      await axios.put(
        "http://localhost:8080/api/v1/users/doctor/update", 
        userData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEdit(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
    setLoading(false);
  };

  if (loading && !isEdit) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your professional information and settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            {isEdit && (
              <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Change Cover
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-8 relative">
            {/* Profile Picture */}
            <div className="-mt-20 mb-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                  <img
                    src={userData.image || imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = assets.default_image;
                    }}
                  />
                </div>
                {isEdit && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name Section */}
            <div className="mb-8">
              {isEdit ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">
                  Dr. {userData.firstName} {userData.lastName}
                </h2>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      {isEdit ? (
                        <input
                          type="tel"
                          value={userData.phoneNumber}
                          onChange={(e) =>
                            setUserData({ ...userData, phoneNumber: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Gender
                      </label>
                      {isEdit ? (
                        <select
                          value={userData.gender}
                          onChange={(e) =>
                            setUserData({ ...userData, gender: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 capitalize">{userData.gender?.toLowerCase()}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Date of Birth
                      </label>
                      {isEdit ? (
                        <input
                          type="date"
                          value={userData.dob}
                          onChange={(e) =>
                            setUserData({ ...userData, dob: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Professional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Specialization
                      </label>
                      {isEdit ? (
                        <input
                          type="text"
                          value={userData.specialization}
                          onChange={(e) =>
                            setUserData({ ...userData, specialization: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userData.specialization || "Not specified"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Consultation Fee
                      </label>
                      {isEdit ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">₹</span>
                          </div>
                          <input
                            type="number"
                            value={userData.doctor_fees}
                            onChange={(e) =>
                              setUserData({ ...userData, doctor_fees: e.target.value })
                            }
                            className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-900">
                          {userData.doctor_fees ? `₹${userData.doctor_fees}` : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                About
              </h3>
              {isEdit ? (
                <textarea
                  value={userData.about}
                  onChange={(e) =>
                    setUserData({ ...userData, about: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell patients about your experience, qualifications, and approach..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-line">
                  {userData.about || "No information provided"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex justify-end">
              {isEdit ? (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEdit(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DoctorProfile;
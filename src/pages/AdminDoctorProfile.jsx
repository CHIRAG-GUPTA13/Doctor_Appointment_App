import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

function DoctorAdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Doctor logged out");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 sm:px-20 py-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          Care Connect <span className="text-sm font-normal text-gray-500">(Admin)</span>
        </div>
      </div>
      <button 
        onClick={handleLogout}
        className="px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
}

function AdminDoctorProfile() {
  const { docId } = useParams();
  const navigate = useNavigate();
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
  const [imagePreview, setImagePreview] = useState(assets.profile_pic);
  const [loading, setLoading] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(
          `http://localhost:8080/api/v1/users/doctor/get/${docId}`
        );

        if (userResponse.data?.obj) {
          setUserData({
            ...userResponse.data.obj,
            image: null,
          });
        }

        try {
          const imageResponse = await axios.get(
            `http://localhost:8080/api/v1/images/download/image/${docId}`,
            { responseType: "blob" }
          );
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setHasUploadedImage(true);
          setUserData(prev => ({ ...prev, image: imageUrl }));
        } catch (imageError) {
          console.log("No profile image found");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [docId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = hasUploadedImage
        ? `http://localhost:8080/api/v1/images/update/image/${docId}`
        : `http://localhost:8080/api/v1/images/upload/${docId}`;
      
      const method = hasUploadedImage ? "put" : "post";

      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update preview immediately
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
      await axios.put(
        `http://localhost:8080/api/v1/users/doctor/update/${docId}`,
        userData,
        { headers: { "Content-Type": "application/json" } }
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-500 mr-3"
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DoctorAdminNavbar/>
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header - Removed the duplicate header since we have it in navbar */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Doctor Profile Management</h1>
              <p className="text-gray-600 mt-1">View and manage doctor profile information</p>
            </div>
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            {isEdit && (
              <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Change Cover
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-8 sm:px-8">
            {/* Profile Picture */}
            <div className="-mt-20 mb-6 flex items-end">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md">
                  <img 
                    src={userData.image || imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = assets.profile_pic;
                    }}
                  />
                </div>
                {isEdit && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Name Section */}
            <div className="mb-8">
              {isEdit ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h1>
              )}
              <p className="text-indigo-600 font-medium mt-1">{userData.specialization}</p>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    {isEdit ? (
                      <input
                        type="tel"
                        value={userData.phoneNumber}
                        onChange={(e) => setUserData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userData.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  Professional Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Specialization</label>
                    {isEdit ? (
                      <input
                        type="text"
                        value={userData.specialization}
                        onChange={(e) => setUserData(prev => ({ ...prev, specialization: e.target.value }))}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userData.specialization}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Experience</label>
                    {isEdit ? (
                      <input
                        type="text"
                        value={userData.experience}
                        onChange={(e) => setUserData(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userData.experience} years</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Consultation Fee</label>
                    {isEdit ? (
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="text"
                          value={userData.doctor_fees}
                          onChange={(e) => setUserData(prev => ({ ...prev, doctor_fees: e.target.value }))}
                          className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-900">${userData.doctor_fees}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Gender</label>
                    {isEdit ? (
                      <select
                        value={userData.gender}
                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900">{userData.gender}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    {isEdit ? (
                      <input
                        type="date"
                        value={userData.dob}
                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{new Date(userData.dob).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Points and About Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Doctor Points
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Total Points</label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {userData.total_points || "0"} 
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Reputation Score
                      </span>
                    </p>
                  </div>
                  
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  About
                </h2>
                {isEdit ? (
                  <textarea
                    value={userData.about}
                    onChange={(e) => setUserData(prev => ({ ...prev, about: e.target.value }))}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-line">{userData.about || "No information provided"}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              {isEdit ? (
                <>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default AdminDoctorProfile;
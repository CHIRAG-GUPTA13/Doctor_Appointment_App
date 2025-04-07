import { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import Cookies from "js-cookie";

function MyProfile() {
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    image: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(assets.profile_pic);
  const [loading, setLoading] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("jwt");
  
        // Fetch user data first
        const userResponse = await axios.get("http://localhost:8080/api/v1/users/patient/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (userResponse.data && userResponse.data.obj) {
          setUserData((prevState) => ({
            ...prevState,
            ...userResponse.data.obj,
            image: null,
          }));
        }
  
        // Try fetching the image separately
        try {
          const imageResponse = await axios.get(
            "http://localhost:8080/api/v1/images/download/image",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          );
  
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setUserData((prevState) => ({
            ...prevState,
            image: imageUrl,
          }));
        } catch (imageError) {
          console.warn("No image available for the user.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      let uploadUrl = hasUploadedImage
        ? "http://localhost:8080/api/v1/images/update/image"
        : "http://localhost:8080/api/v1/images/upload";
  
      await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setHasUploadedImage(true);
      fetchUpdatedImage();
    } catch (error) {
      console.error("Error uploading/updating image:", error);
    }
  };
  
  const fetchUpdatedImage = async () => {
    try {
      const token = Cookies.get("jwt");
      const imageResponse = await axios.get(
        "http://localhost:8080/api/v1/images/download/image",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
  
      const imageUrl = URL.createObjectURL(imageResponse.data);
      setUserData((prevState) => ({
        ...prevState,
        image: imageUrl,
      }));
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Error fetching updated image:", error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("jwt");
      
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        dob: userData.dob,
      };

      await axios.put(
        "http://localhost:8080/api/v1/users/patient/update", 
        updateData, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            {isEdit && (
              <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all transform hover:scale-105">
                <i className="fas fa-camera mr-2"></i>
                Change Cover
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-8 sm:px-8">
            {/* Profile Picture */}
            <div className="-mt-24 mb-6 flex items-end">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 transition-all duration-300 hover:shadow-xl">
                  <img
                    src={userData.image || imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEdit && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <i className="fas fa-camera text-indigo-600 text-xl"></i>
                    </div>
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

            {/* Profile Info */}
            <div className="space-y-8">
              {/* Name Section */}
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  {isEdit ? (
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                        <input
                          type="text"
                          value={userData.firstName}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="w-full text-2xl sm:text-3xl font-semibold bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={userData.lastName}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="w-full text-2xl sm:text-3xl font-semibold bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </h1>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-full mr-3">
                      <i className="fas fa-address-card text-indigo-600"></i>
                    </span>
                    Contact Information
                  </h2>
                  <div className="space-y-4 pl-11">
                    <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{userData.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                      <p className="text-gray-900 font-medium">{userData.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-full mr-3">
                      <i className="fas fa-user text-indigo-600"></i>
                    </span>
                    Basic Information
                  </h2>
                  <div className="space-y-4 pl-11">
                    <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                      {isEdit ? (
                        <select
                          value={userData.gender}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                          className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium">{userData.gender || "Not specified"}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Birthday</label>
                      {isEdit ? (
                        <input
                          type="date"
                          value={userData.dob}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              dob: e.target.value,
                            }))
                          }
                          className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-6">
                {isEdit ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEdit(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 flex items-center"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 flex items-center"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MyProfile;
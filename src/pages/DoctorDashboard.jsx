import React, { useState } from 'react';
import DoctorAppointments from './DoctorAppointments';
import DoctorProfile from './DoctorProfile';
import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom";
function DoctorAdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    Cookies.remove("jwt", { path: "/" });
    console.log("Doctor logged out");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-20 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-blue-600 cursor-pointer ml-4">
        Care Connect <span className="text-sm font-normal text-gray-500">(Doctor)</span>
      </div>
      <button 
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 mr-4"
      >
        Logout
      </button>
    </div>
  );
}

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <DoctorAdminNavbar/>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Centered with max-width */}
        <aside className="w-56 bg-white shadow-lg mx-4 my-4 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Doctor Panel</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleTabChange('appointments')}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === 'appointments' 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange('Profile')}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === 'Profile' 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area - Centered with max-width */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full">
            {activeTab === 'appointments' && <DoctorAppointments />}
            {activeTab === 'Profile' && <DoctorProfile />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
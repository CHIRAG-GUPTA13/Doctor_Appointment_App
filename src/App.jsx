import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import PatientAppointments from "./pages/PatientAppointments";
import Appointment from "./pages/Appointment";
import Doctor from "./pages/Doctor";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AppContextProvider from "./context/AppContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DoctorSignup from "./pages/DoctorSignup";
import DoctorProfile from "./pages/DoctorProfile";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import AdminLogin from "./pages/AdminLogin";
import AllDoctor from "./pages/AllDoctors";
import AdminDoctorProfile from "./pages/AdminDoctorProfile";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  const navbarRef = useRef();

  return (
    <AppContextProvider>
      <Routes>
        {/* Routes with the default Navbar and Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar ref={navbarRef} />
              <div className="mx-4 sm:mx-[10%]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/login" 
                    element={<Login onLoginSuccess={(token) => {
                      if (navbarRef.current) {
                        navbarRef.current.handleLoginSuccess(token);
                      }
                    }} />} 
                  />
                  <Route 
                    path="/PatientLogin" 
                    element={<PatientLogin onLoginSuccess={(token) => {
                      if (navbarRef.current) {
                        navbarRef.current.handleLoginSuccess(token);
                      }
                    }} />} 
                  />
                  <Route path="/doctorLogin" element={<DoctorLogin />} />
                  <Route path="/adminLogin" element={<AdminLogin />} />
                  <Route path="/doctor" element={<Doctor />} />
                  <Route path="/doctor/:speciality" element={<Doctor />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/my-profile" element={<MyProfile />} />
                  <Route path="/patient-appointments" element={<PatientAppointments />} />
                  <Route path="/appointment/:docId" element={<Appointment />} />
                </Routes>
              </div>
              <Footer />
            </>
          }
        />

        {/* Route(s) with the Special Layout */}
        
        <Route path="/doctorDashboard" element={<DoctorDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adminDoctorProfile/:docId" element={<AdminDoctorProfile />} />
      </Routes>
    </AppContextProvider>
  );
}

export default App;
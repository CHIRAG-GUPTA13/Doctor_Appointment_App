import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import Cookies from "js-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

function Appointment() {
    const { docId } = useParams();
    const { doctors, currencySymbol } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState('');
    const [doctorImage, setDoctorImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTimeSlots, setShowTimeSlots] = useState(false);

    useEffect(() => {
        fetchDocInfo();
    }, [docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    const fetchDocInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/v1/users/doctor/get/${docId}`);
            const data = await response.json();

            if (data.message === "doctor found") {
                const doctorData = data.obj;
                setDocInfo({
                    _id: doctorData.id,
                    name: `${doctorData.firstName} ${doctorData.lastName}`,
                    speciality: doctorData.specialization,
                    experience: `${doctorData.experience} years`,
                    about: doctorData.about,
                    fees: doctorData.doctor_fees,
                    image: assets.doctor_2,
                });
                await fetchDoctorImage(doctorData.id);
            } else {
                toast.error("Doctor not found");
            }
        } catch (error) {
            toast.error("Error fetching doctor info");
            console.error("Error fetching doctor info:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorImage = async (doctorId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/images/download/image/${doctorId}`);
            if (response.ok) {
                const blob = await response.blob();
                setDoctorImage(URL.createObjectURL(blob));
            }
        } catch (error) {
            console.error("Error fetching doctor image:", error);
        }
    };

    const getAvailableSlots = () => {
        const today = new Date();
        const slots = [];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            
            const startHour = i === 0 ? Math.max(currentDate.getHours(), 10) : 10;
            const endHour = 18;
            
            currentDate.setHours(startHour, 0, 0, 0);
            const endTime = new Date(currentDate);
            endTime.setHours(endHour, 0, 0, 0);
            
            const timeSlots = [];
            while (currentDate < endTime) {
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: currentDate.toTimeString().split(' ')[0].substring(0, 5)
                });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            
            slots.push(timeSlots);
        }
        
        setDocSlots(slots);
    };

    const handleDaySelect = (index) => {
        setSelectedDayIndex(index);
        setShowTimeSlots(true);
        setSelectedTime('');
    };

    const bookAppointment = async () => {
        if (!selectedTime) {
            toast.error("Please select a time slot");
            return;
        }

        const selectedDate = docSlots[selectedDayIndex][0].datetime;
        const formattedDateTime = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}T${selectedTime}:00`;

        try {
            const token = Cookies.get("jwt");
            setLoading(true);
            const response = await axios.post(
                `http://localhost:8080/api/v1/appointments/appointment/book?doctorId=${docInfo._id}&localDateTime=${formattedDateTime}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Appointment booked successfully!");
            } else {
                toast.error(`Failed to book appointment: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !docInfo) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return docInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Doctor Info Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-8 mb-12"
            >
                <div className="lg:w-1/3">
                    <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl p-4 shadow-sm">
                        {doctorImage ? (
                            <img 
                                src={doctorImage} 
                                alt="Doctor" 
                                className="w-full h-80 object-cover rounded-xl shadow-md"
                            />
                        ) : (
                            <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center">
                                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-2/3">
                    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 h-full">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    Dr. {docInfo.name}
                                    <img className="w-6" src={assets.verified_icon} alt="Verified" />
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {docInfo.speciality}
                                    </span>
                                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {docInfo.experience} experience
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm">Consultation fee</p>
                                <p className="text-2xl font-bold text-blue-600">{currencySymbol}{docInfo.fees}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                About
                            </h3>
                            <p className="text-gray-600 mt-2 leading-relaxed">{docInfo.about}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Appointment Time Selection Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-8 mb-12"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h2>
                
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Select Date</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                        {docSlots.length > 0 && docSlots.map((daySlots, index) => {
                            const date = daySlots[0]?.datetime;
                            if (!date) return null;
                            
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDaySelect(index)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 text-center border
                                        ${selectedDayIndex === index 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                                            : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                                >
                                    <p className="text-sm font-medium">{daysOfWeek[date.getDay()]}</p>
                                    <p className="text-lg font-bold mt-1">{date.getDate()}</p>
                                    <p className="text-xs mt-1">
                                        {date.toLocaleString('default', { month: 'short' })}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {showTimeSlots && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                    >
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Available Time Slots for {daysOfWeek[docSlots[selectedDayIndex][0]?.datetime.getDay()]}, 
                            {docSlots[selectedDayIndex][0]?.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {docSlots[selectedDayIndex]?.map((slot, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedTime(slot.time)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 text-center border
                                        ${selectedTime === slot.time 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                            : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                                >
                                    <p className="font-medium">{slot.time}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {selectedTime && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-800">Your Appointment</h4>
                                <p className="text-gray-600">
                                    {daysOfWeek[docSlots[selectedDayIndex][0]?.datetime.getDay()]}, 
                                    {docSlots[selectedDayIndex][0]?.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                                    at {selectedTime}
                                </p>
                            </div>
                            <button
                                onClick={bookAppointment}
                                disabled={loading}
                                className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors duration-300 w-full sm:w-auto"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Booking...
                                    </span>
                                ) : "Confirm Appointment"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Related Doctors Section */}
            {/* <RelatedDoctors docId={docId} speciality={docInfo.speciality} /> */}
        </div>
    );
}

export default Appointment;
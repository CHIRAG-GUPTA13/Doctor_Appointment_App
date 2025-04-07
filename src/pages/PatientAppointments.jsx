import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiDollarSign, FiX, FiCheck, FiChevronRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRupeeSign } from "react-icons/fa";

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctorImages, setDoctorImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/v1/appointments/appointment/patient", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appointmentsData = response.data.obj || [];
      setAppointments(appointmentsData);

      // Fetch doctor images
      const imagePromises = appointmentsData.map(async (appointment) => {
        const doctorId = appointment.doctor.id;
        if (!doctorImages[doctorId]) {
          try {
            const imgResponse = await axios.get(`http://localhost:8080/api/v1/images/download/image/${doctorId}`, {
              responseType: "blob",
            });
            return { doctorId, imageUrl: URL.createObjectURL(imgResponse.data) };
          } catch (error) {
            console.error(`Error fetching image for doctor ${doctorId}:`, error);
            return { doctorId, imageUrl: "/default-doctor.png" };
          }
        }
        return null;
      });

      const images = (await Promise.all(imagePromises)).filter(Boolean);
      const newDoctorImages = {};
      images.forEach((img) => {
        newDoctorImages[img.doctorId] = img.imageUrl;
      });

      setDoctorImages((prev) => ({ ...prev, ...newDoctorImages }));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.response?.data?.message || "Failed to load appointments. Please try again.");
      toast.error(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Categorize appointments
  const categorizeAppointments = () => {
    const now = new Date();
    
    return appointments.reduce((acc, appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const isPast = appointmentDate < now || appointment.appointmentStatus === 'COMPLETED';
      
      if (isPast) {
        acc.past.push(appointment);
      } else {
        acc.upcoming.push(appointment);
      }
      
      return acc;
    }, { upcoming: [], past: [] });
  };

  const { upcoming, past } = categorizeAppointments();

  // Sort upcoming appointments by date (soonest first)
  upcoming.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  
  // Sort past appointments by date (most recent first)
  past.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const cancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const token = Cookies.get("jwt");
    if (!token) {
      setError("Authentication required. Please log in.");
      toast.error("Authentication required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/v1/appointments/appointment/cancel/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI update
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, appointmentStatus: "CANCELLED" } : appt
        )
      );
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel the appointment. Please try again.");
    }
  };

  const handlePayment = (appointmentId) => {
    toast.info("Redirecting to payment gateway...");
    setTimeout(() => {
      toast.success("Payment successful!");
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, paymentStatus: "PAID" } : appt
        )
      );
    }, 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
          <p className="text-lg text-gray-600">Loading your appointments...</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiX className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Appointments
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Manage your upcoming and past medical appointments
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${activeTab === 'upcoming' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
              {upcoming.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {upcoming.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`${activeTab === 'past' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Past Appointments
              {past.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {past.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {activeTab === 'upcoming' ? (
          upcoming.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <FiCalendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any upcoming appointments scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  doctorImages={doctorImages}
                  onCancel={cancelAppointment}
                  onPayment={handlePayment}
                  showActions={true}
                />
              ))}
            </div>
          )
        ) : past.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <FiCheck className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No past appointments</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any past appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {past.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                doctorImages={doctorImages}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const AppointmentCard = ({ appointment, doctorImages, onCancel, onPayment, showActions }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6 sm:flex sm:items-start">
        <div className="flex-shrink-0 mr-4 sm:mr-6">
          <img
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
            src={doctorImages[appointment.doctor.id] || "/default-doctor.png"}
            alt={`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                appointment.appointmentStatus
              )}`}
            >
              {appointment.appointmentStatus}
            </span>
          </div>

          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiUser className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {appointment.doctor.specialty || "General Practitioner"}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {formatDate(appointment.appointmentDate)}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {formatTime(appointment.appointmentDate)}
            </div>
          </div>

          {showActions && appointment.appointmentStatus !== "COMPLETED" && appointment.appointmentStatus !== "CANCELLED" && (
            <div className="mt-4 flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => onPayment(appointment.id)}
              >
                <FaRupeeSign className="-ml-1 mr-2 h-4 w-4" />
                Pay Online
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => onCancel(appointment.id)}
              >
                <FiX className="-ml-1 mr-2 h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="hidden sm:flex sm:items-center sm:ml-4">
          <FiChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

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
      const response = await axios.get(
        "http://localhost:8080/api/v1/appointments/appointment/doctor",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(response.data.obj || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, action) => {
    const confirmAction = window.confirm(
      `Are you sure you want to mark this appointment as ${action}?`
    );
    if (!confirmAction) return;

    const token = Cookies.get("jwt");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/v1/appointments/appointment/${action}/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(`Failed to update appointment: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.appointmentStatus === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          My Appointments
        </h1>
        <p className="text-gray-600">Manage your upcoming and past appointments</p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Appointments</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"}
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Patient Info */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {appointment.patient.firstName.charAt(0)}
                        {appointment.patient.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatTime(appointment.appointmentDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        appointment.appointmentStatus
                      )}`}
                    >
                      {appointment.appointmentStatus}
                    </span>

                    {appointment.appointmentStatus !== "COMPLETED" && (
                      <div className="flex space-x-2">
                        {appointment.appointmentStatus !== "CONFIRMED" && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, "confirm")}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, "complete")}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== "all"
                ? "No appointments match your current filter"
                : "You don't have any appointments scheduled yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;
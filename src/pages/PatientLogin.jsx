import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Cookies from "js-cookie";

function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/v1/public/patient/login", {
        email,
        password,
      });
      console.log(response.data.message);
      const token = response.data.obj.token;
      Cookies.set("jwt", token, { expires: 1, secure: true, sameSite: "Strict" });
      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <form className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md" onSubmit={onSubmitHandler}>
        <h2 className="text-3xl font-bold text-blue-800 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-6">Login to continue</p>

        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative mb-6">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
          Login
        </button>

        <p className="text-center text-gray-700 text-sm mt-4">
          New here?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default PatientLogin;
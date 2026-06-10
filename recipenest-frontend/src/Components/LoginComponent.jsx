import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaFacebook } from "react-icons/fa"; // import icons
import { FcGoogle } from "react-icons/fc"; // import google icon
import "../Css/login.css"; // import css file for login styles
import axios from "../api/axios";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { ToastContainer, toast } from 'react-toastify'; // import Toastify
import 'react-toastify/dist/ReactToastify.css'; // import Toastify CSS
import fork from'../pictures/fork.png';

const LoginComponent = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // useNavigate hook to handle navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value, // update the respective input field
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on submit
  
    const dataToSend = {
      Email: loginData.email,
      Password: loginData.password,
    };
  
    try {
      const response = await axios.post('/User/Login', dataToSend);
      console.log('Response from API:', response.data);
    
      // store logged in user info or token
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    
      toast.success("Login successful!"); // toast instead of alert

      // Check the role and navigate to the correct dashboard
      const user = response.data.user;
      setTimeout(() => {
        if (user.role === "FoodLover") {
          navigate("/foodlover");
        } else if (user.role === "Admin") {
          navigate("/admindash");
        } else if (user.role === "Chef") {
          navigate("/chefdash");
        } else {
          navigate("/"); // Default to general dashboard
        }
      }, 3500); // small delay so user can see the success toast

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password!");
      } else {
        console.error('Login Error:', error);
        toast.error("Something went wrong during login.");
      }
    }
  }

  return (
    <div className="loginComponent">
      <div className="login-container">
        <div className="left-section">
          <h2>
            Welcome to <br /> Recipe Nest!
          </h2>
          <div className="fork-icon">
            <img src={fork} alt="Fork Icon" />
          </div>
          <p>Don’t have an account?</p>
          <Link to="/register" className="register-link">Register Here</Link> 
        </div>

        <div className="right-section">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                value={loginData.email}
                className="input-field"
              />
            </div>

            <div className="icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                value={loginData.password}
                className="input-field"
              />
            </div>

            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link> 

            <button type="submit" className="login-button">Login</button> 

            <p className="continue-text">Continue with</p> 
            <div className="social-login">
              <FcGoogle className="social-icon" title="Login with Google" />
              <FaFacebook className="social-icon facebook-icon" title="Login with Facebook" />
            </div>
          </form>
        </div>
      </div>

      {/* Toast container to display toast messages */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LoginComponent;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../Css/Register.css";
import axios from '../api/axios';
import fork from '../pictures/fork.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    role: '',
    username: '',
    password: '',
    confirmpassword: '',
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!/[@#_]/.test(password)) return "Password must include @, #, or _.";
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return "Password must contain both uppercase and lowercase letters.";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fullname.length < 3) {
      toast.error("Fullname must be at least 3 characters");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      toast.error(passwordValidationError);
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const dataToSend = {
      FullName: formData.fullname,
      Email: formData.email,
      Role: formData.role,
      Username: formData.username,
      Password: formData.password,
      ConfirmPassword: formData.confirmpassword,
    };

    try {
      setLoading(true);
      const response = await axios.post('/User/Create', dataToSend);
      console.log('Response from API:', response.data);
      toast.success("User registered successfully!");

    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("This email is already registered.");
      } else {
        console.error('Error:', error);
        toast.error("Error: Could not register user!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerform">
      <form className="register" onSubmit={handleSubmit}>
        <div className="leftside">
          <h1>Welcome to Recipe Nest!</h1>
          <img src={fork} alt="fork.png" />
          <h3>Already have an account?</h3>
          <Link to="/login">Login</Link>
        </div>

        <div className="form">
          <h2>Register</h2>

          <input
            type="text"
            name="fullname"
            placeholder="Fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="FoodLover">FoodLover</option>
            <option value="Chef">Chef</option>
          </select>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <div className="password-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span className="eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
              👁️
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChange={handleInputChange}
              required
            />
            <span className="eye-icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              👁️
            </span>
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}

export default Register;

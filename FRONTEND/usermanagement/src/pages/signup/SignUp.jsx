import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosconfig.js';
import { setAuthData } from '../../redux/auth/authSlice'; 
import './Signup.css';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    email: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required";
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {  
    tempErrors.username = "Username can only contain letters (no numbers or special characters)";
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number is invalid";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(formData.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter, one special character, one digit, and one lowercase letter";
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log(formData.username, formData.email);
        
        const response = await axiosInstance.post('/api/signup/', {
          username: formData.username,
          phone_number: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        });
        // dispatch(setAuthData(response.data));
        toast.success("Your Account Activated Succesfully Login")
        navigate('/login');
      } catch (error) {
        console.error('Signup failed:', error.response?.data || error.message);
        toast.error(error.response?.data || {}); // Show errors to the user
        console.log(errors)
      }
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-form'>
        <div className='signup-avatar-container'>
          <div className='signup-avatar'>
            <h2>User Register</h2>
          </div>
        </div>
        <form onSubmit={handleSignup}>
          <div className='input-container'>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>
          <div className='input-container'>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>
          <div className='input-container'>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className='input-container'>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className='input-container'>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className='signup-button'>SIGNUP</button>
        </form>
        <div className='redirect'>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
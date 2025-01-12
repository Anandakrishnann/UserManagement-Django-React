import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthData } from '../../redux/auth/authSlice.jsx';
import './Login.css';
import axiosInstance from '../../axiosconfig.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/login/', { email, password });

            const data = response.data
            console.log(data.user.is_admin);
            console.log(data);
            
            
            
            localStorage.setItem(ACCESS_TOKEN, data.access);
            localStorage.setItem(REFRESH_TOKEN, data.refresh);

            const isAuthenticated = true
            const isAdmin = data.user.is_admin
            
            dispatch(setAuthData({
                user: data.user,
                token: data.access,
                isAuthenticated: isAuthenticated,
                isAdmin: isAdmin,
            }));
            console.log("is admin true",data.user.is_admin);

            if (isAdmin) {
                setTimeout(() => navigate('/dashboard'), 100);
                toast.success("Welcome to Dashboard")
            } else {
                toast.success("Welcome Successfully Logged in")
                setTimeout(() => navigate('/home'), 100);
            }
            

        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error || 'Invalid credentials');
            } else {
                toast.error('An error occurred during login');
            }
        }
    }

    return (
        <div className='login-container'>
            <div className='login-form'>
                <div className='avatar-container'>
                    <div className='avatar'>
                    <h2>User Login</h2>
                    </div>
                </div>
                <form onSubmit={handleLogin}>
                    <div className='input-container'>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            required
                        />
                    </div>
                    <div className='input-container'>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <span className='password-toggle'></span>
                    </div>
                    <button type='submit' className='login-button'>LOGIN</button>
                </form>
                <div className='redirect'>
                    <p>Don't have an acoount ?<Link to="/signup">Signup</Link><br /> </p>
                </div>
            </div>
            
        </div>
    )
};

export default Login
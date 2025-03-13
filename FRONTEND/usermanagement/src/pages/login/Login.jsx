import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthData } from '../../redux/auth/authSlice.jsx';
import './Login.css';
import axiosInstance from '../../axiosconfig.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants.js';
import { loginUser } from '../../redux/thunks/authThunks';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password, navigate));
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
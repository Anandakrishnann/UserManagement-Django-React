import axiosInstance from '../../axiosconfig';
import { setAuthData } from '../auth/authSlice';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { toast } from 'react-toastify';

export const loginUser = (email, password, navigate) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/api/login/', { email, password });
        const data = response.data;

        // Save tokens to localStorage
        localStorage.setItem(ACCESS_TOKEN, data.access);
        localStorage.setItem(REFRESH_TOKEN, data.refresh);

        const isAuthenticated = true;
        const isAdmin = data.user.is_admin;

        // Dispatch the authentication data
        dispatch(setAuthData({
            user: data.user,
            token: data.access,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
        }));

        // Navigate and show a toast
        if (isAdmin) {
            toast.success('Welcome to Dashboard');
            setTimeout(() => navigate('/dashboard'), 100);
        } else {
            toast.success('Successfully Logged in');
            setTimeout(() => navigate('/home'), 100);
        }
    } catch (error) {
        if (error.response && error.response.data) {
            toast.error(error.response.data.error || 'Invalid credentials');
        } else {    
            toast.error('An error occurred during login');
        }
    }
};

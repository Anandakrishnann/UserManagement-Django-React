import { createSlice } from '@reduxjs/toolkit';

// Initialize state with localStorage data
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isAdmin: JSON.parse(localStorage.getItem('user'))?.is_admin || false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isAdmin = action.payload.isAdmin;

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        clearAuthData(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            // Remove from localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;

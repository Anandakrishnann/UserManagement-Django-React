import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { thunk } from 'redux-thunk'; 

const store = configureStore({
    reducer: {
        auth: authReducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
});

export default store;

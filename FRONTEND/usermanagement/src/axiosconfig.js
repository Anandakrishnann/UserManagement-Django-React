// axiosconfig.js
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("Sending Request with Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url !== "/token/refresh/") {
      try {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        if (!refresh) throw new Error("No refresh token available");
    
        const { data } = await axios.post("/token/refresh/", { refresh });
        localStorage.setItem(ACCESS_TOKEN, data.access);
    
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token Refresh Failed:", refreshError.response?.data);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    

    return Promise.reject(error);
  }
);


export default axiosInstance;
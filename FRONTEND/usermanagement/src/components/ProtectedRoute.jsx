import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../axiosconfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function ProtectedRoutes({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false)); // Potentially causes a re-render loop
  }, [isAuthorized]); // Dependency array ensures this runs only once

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await axiosInstance.post("/token/refresh/", { refresh: refreshToken });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true); // State update
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken(); // May trigger re-renders if `refreshToken` causes state updates
    } else {
      setIsAuthorized(true); // State update
    }
  };

  if (isAuthorized === null) {
    return <div>Loading....</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}


export default ProtectedRoutes;
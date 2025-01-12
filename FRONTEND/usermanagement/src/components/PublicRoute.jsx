import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); 
    }
  }, [isAuthenticated]); // Include isAuthenticated in the dependency array

  // If not authenticated, render the children components (e.g., Login/Signup)
  return children;
};

export default PublicRoute;

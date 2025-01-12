import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  console.log("isAdmin",isAdmin)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/unauthorized'); 
    }
  }, [isAdmin]); // Include isAuthenticated in the dependency array

  // If not authenticated, render the children components (e.g., Login/Signup)
  return children;
};

export default AdminProtectedRoute;

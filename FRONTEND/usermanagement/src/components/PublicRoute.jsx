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
  }, [isAuthenticated]); 

  return children;
};

export default PublicRoute;

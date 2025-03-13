import React from 'react';
import './NotFound.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const NotFound = () => {
  const login = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate()
  const goHome = () => {
    if(!login){
      navigate('/login')
    }else{
      navigate('/home')
    }
  }

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">Page Not Found</p>
      <p onClick={goHome} className="not-found-button">Go Back Home</p>
    </div>
  );
};

export default NotFound;

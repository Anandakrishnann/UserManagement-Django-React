import React,{useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthData,clearAuthData } from '../../redux/auth/authSlice';
import './Home.css';
import { toast } from 'react-toastify';

function Home() {
  const user = useSelector((state) => state.auth.user);
  console.log("user uis|",user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        dispatch(setAuthData({ user: parsedUserData }));
        navigate('/profile')
      } else {
        localStorage.clear()
        navigate('/login');
      }
    }
  }, [dispatch, navigate, user]);

  const handleLogout = () => {
    dispatch(clearAuthData());
    toast.success("Successfully Logged Out")
    localStorage.clear()
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">CodeX</div>
        <div className="navbar-menu">
          <Link to="/profile" className="navbar-item">Profile</Link>
          <button onClick={handleLogout} className="navbar-item logout-btn">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <h1 className='user'>Welcome, {user ? user.username : 'Guest'}!</h1>
        <p>This is your personalized home page. Explore and enjoy!</p>
      </main>
    </div>
  );
}

export default Home;
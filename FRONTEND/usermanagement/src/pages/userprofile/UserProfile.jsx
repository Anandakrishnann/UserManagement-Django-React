import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosconfig';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthData } from '../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null)

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/profile-picture/");
        if (response.data && response.data.profile_picture) {
          setImage(response.data.profile_picture); // Set image if available
        } else {
          setImage(null); // No image, set it to null
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error.message); 
        setImage(null); // Optionally, display a default image if error occurs
      }
    };
    fetchUserProfile();
  }, [image]);
  
  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.querySelector('.file-input');
    const file = fileInput?.files[0];
  
    if (!file) return;
  
    const formData = new FormData();
    formData.append('profile_picture', file);
  
    try {
      setUploading(true);
      const response = await axiosInstance.post('/api/upload-profile-picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Update user profile picture in Redux and localStorage
      const updatedUser = { ...user, profile_picture: response.data.profile_picture }; // Corrected key
      dispatch(setAuthData({ user: updatedUser, token: localStorage.getItem('token'), isAuthenticated: true, isAdmin: user.isAdmin }));
      setImage(response.data.profile_picture); // Update image preview
      setShowModal(false);
      setPreview(null);
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };
  

  const goback = () => {
    navigate('/home');
  };

  return (
    <div className="user-profile">
      <div className="left-section">
        <div className="header">
          <h2>My Account</h2>
          <button className="goback" onClick={goback}>Go Back</button>
        </div>
        <div className="right-section">
          <div className="actions">
          <img
            src={image || '/default-avatar.png'} // Default avatar if no image
            alt="Profile"
            className="profile-picture"
          />
            <button onClick={() => setShowModal(true)}>Upload</button>
          </div>
          <h2 className="username">{user?.username || 'Username'}</h2>
          <p>{user?.email || 'Email'}</p>
          <p>{user?.phone_number || 'Phone Number'}</p>
        </div>

        <div className="form-section">
          <h3>USER INFORMATION</h3>
          <div className="form-grid">
            <div>
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
            </div>
            <div>
              <label>Email address</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-grid">
            <div>
              <label>Phone Number</label>
              <input type="text" value={user?.phone_number || ''} disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for uploading image */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
            />
            {preview && (
              <div className="preview">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            )}
            <div className="modal-actions">
              <button onClick={handleUpload} className="upload-btn" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

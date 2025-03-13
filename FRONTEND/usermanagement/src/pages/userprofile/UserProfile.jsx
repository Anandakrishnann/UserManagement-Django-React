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
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', phone_number: '' });
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/profile-picture/');
        if (response.data && response.data.profile_picture) {
          setImage(response.data.profile_picture);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error.message);
        setImage(null);
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

      const updatedUser = { ...user, profile_picture: response.data.profile_picture };
      dispatch(setAuthData({ user: updatedUser, token: localStorage.getItem('token'), isAuthenticated: true, isAdmin: user.isAdmin }));
      setImage(response.data.profile_picture);
      setShowModal(false);
      setPreview(null);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (data) => {
    let tempErrors = {};
    if (!data.email.trim()) {
      tempErrors.email = 'Email is required';
      toast.error('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = 'Email is invalid';
      toast.error('Email is invalid')
    }
    if (!data.username.trim()) {
      tempErrors.username = 'Username is required';
      toast.error('Username is required')
    } else if (!/^[a-zA-Z]+$/.test(data.username)) {
      tempErrors.username = 'Username can only contain letters (no numbers or special characters)';
      toast.error( 'Username can only contain letters (no numbers or special characters)')
    }
    if (!data.phone_number.trim()) {
      tempErrors.phone_number = 'Phone number is required';
      toast.error('Phone number is required')
    } else if (!/^\d{10}$/.test(data.phone_number)) {
      tempErrors.phone_number = 'Phone number is invalid';
      toast.error('Phone number is invalid')
    }
    return tempErrors;
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({
        username: user?.username || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
      });
      setErrors({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const validationErrors = validateForm(editForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.put('/api/update-profile/', editForm);
      const updatedUser = { ...user, ...response.data.data };

      dispatch(setAuthData({
        user: updatedUser,
        token: localStorage.getItem('token'),
        isAuthenticated: true,
        isAdmin: user?.isAdmin || false,
      }));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error('Failed to update profile');
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
              src={image || '/default-avatar.png'}
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
              <input
                type="text"
                name="username"
                value={isEditing ? editForm.username : user?.username || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            <div>
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={isEditing ? editForm.email : user?.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-grid">
            <div>
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={isEditing ? editForm.phone_number : user?.phone_number || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
            </div>
          </div>
          <div className="edit-actions">
            <button onClick={handleEditToggle} className="edit-btn" style={{
              marginRight: '10px',
              backgroundColor: isEditing ? 'red' : 'blue',
            }}>
              {isEditing ? 'Cancel'  : 'Edit'}
            </button>
            {isEditing && (
              <button style={{ backgroundColor: 'green'}} onClick={handleSave} className="edit-btn">Save</button>
            )}
          </div>
        </div>
      </div>

      { showModal && (
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

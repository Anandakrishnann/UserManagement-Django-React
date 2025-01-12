import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig.js";
import { toast } from "react-toastify";
import "./Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    is_active: true,
  });
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    is_active: true,
  });

  const navigate = useNavigate();

  const validateForm = (data) => {
    let tempErrors = {};
    if (!data.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!data.username.trim()) {
      tempErrors.username = "Username is required";
    } else if (!/^[a-zA-Z]+$/.test(data.username)) {
      tempErrors.username = "Username can only contain letters (no numbers or special characters)";
    }
    if (!data.phone_number.trim()) {
      tempErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone_number)) {
      tempErrors.phone_number = "Phone number is invalid";
    }
    if (data.password && data.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    } else if (data.password && !/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(data.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter, one special character, one digit, and one lowercase letter";
    }
    if (data.password !== data.confirm_password) {
      tempErrors.confirm_password = "Passwords do not match";
    }
    return tempErrors;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the user with ID: ${userId}?`);
    if (confirmDelete) {
      try {
        await axiosInstance.post(`/api/delete/${userId}/`);
        toast.success(`Deleted User with ID: ${userId}`);
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_active: false } : user)));
      } catch (error) {
        toast.error("Error deleting user:", error);
      }
    }
  };

  const handleRestoreUser = async (userId) => {
    const confirmRestore = window.confirm(`Are you sure you want to restore the user with ID: ${userId}?`);
    if (confirmRestore) {
      try {
        await axiosInstance.post(`/api/restore/${userId}/`);
        toast.success(`Restored User with ID: ${userId}`);
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_active: true } : user)));
      } catch (error) {
        toast.error("Error restoring user:", error);
      }
    }
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.post(`/api/create/`, formData);
        setUsers((prevUsers) => [response.data, ...prevUsers]);
        setIsCreateModalOpen(false);
        toast.success("User created successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      Object.values(validationErrors).forEach((error) => toast.error(error));
    }
  };

  useEffect(() => {
    if (editingUser) {
      setEditFormData({
        id: editingUser.id, 
        username: editingUser.username,
        email: editingUser.email,
        phone_number: editingUser.phone_number,
        is_active: editingUser.is_active,
      });
    }
  }, [editingUser]);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(editFormData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.put(`/api/edit/${editFormData.id}/`, editFormData);
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === editFormData.id ? response.data : user)));
        setIsEditModalOpen(false);
        toast.success("User updated successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      Object.values(validationErrors).forEach((error) => toast.error(error));
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>CodeX Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active">Dashboard</button>
        </nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </aside>

      <main>
        <header className="content-header">
          <h1>User Management</h1>
          <div className="header-actions">
            <input
              type="search"
              placeholder="Search users by username or email..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="add-user-btn" onClick={() => setIsCreateModalOpen(true)}>Add New User</button>
          </div>
        </header>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-active ${user.is_active ? "active" : "inactive"}`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => { setEditingUser(user); setIsEditModalOpen(true); }}>Edit</button>
                        {user.is_active ? (
                          <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        ) : (
                          <button className="restore-btn" onClick={() => handleRestoreUser(user.id)}>Restore</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Create New User</div>
            <div className="modal-content">
              <form onSubmit={handleCreateSubmit}>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                />
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  required
                />
                <div className="custom-modal-footer">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="custom-cancel-btn">Cancel</button>
                  <button type="submit" className="custom-save-btn">Create User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Edit User</div>
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                />
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={editFormData.phone_number}
                  onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                  required
                />
                <label>Status:</label>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={editFormData.is_active}
                  onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                />
                <div className="modal-actions">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn">Update User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

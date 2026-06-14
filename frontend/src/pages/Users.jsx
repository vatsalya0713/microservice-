import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Mail, Info } from 'lucide-react';
import StarRating from '../components/StarRating';
import { api } from '../services/api';

export default function Users({ triggerToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailRatings, setUserDetailRatings] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Form input state
  const [formData, setFormData] = useState({ name: '', email: '', about: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.users.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading users', err);
      triggerToast('Failed to load users list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', email: '', about: '' });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setFormData({ name: user.name || '', email: user.email || '', about: user.about || '' });
    setIsEditMode(true);
    setEditUserId(user.userId);
    setIsFormOpen(true);
  };

  const handleViewDetails = async (userId) => {
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    try {
      // The API getUserById retrieves User, resolves Feign client rating data, and maps the hotel names automatically.
      const detailedUser = await api.users.getById(userId);
      setSelectedUser(detailedUser);
      setUserDetailRatings(detailedUser.ratings || []);
    } catch (err) {
      console.error('Error loading detailed user ratings', err);
      triggerToast('Failed to load user ratings and details', 'error');
      setIsDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      triggerToast('Name and Email are required fields', 'error');
      return;
    }

    try {
      if (isEditMode) {
        await api.users.update(editUserId, formData);
        triggerToast('User updated successfully', 'success');
      } else {
        await api.users.create(formData);
        triggerToast('User created successfully', 'success');
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Error submitting user form', err);
      triggerToast('Operation failed. Please try again.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? All their ratings will remain in the ratings collection.')) {
      try {
        await api.users.delete(userId);
        triggerToast('User deleted successfully', 'success');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user', err);
        triggerToast('Failed to delete user', 'error');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Manage Users</h1>
          <p>Register new users, update profile info, and view submitted rating cards.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div>Loading Users...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="card empty-state">
          <h3>No users registered yet</h3>
          <p>Click "Add User" to register a new user in the database.</p>
          <button className="btn btn-secondary" onClick={handleOpenCreate}>Add User</button>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Email Address</th>
                <th>About Info</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <div className="user-badge">
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.about || 'N/A'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button className="btn-icon" onClick={() => handleViewDetails(user.userId)} title="View User Ratings">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => handleOpenEdit(user)} title="Edit User">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteUser(user.userId)} title="Delete User">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE/EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsFormOpen(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit User Details' : 'Add New User'}</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">About / Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Brief description about the user"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Save Changes' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAILS & RATINGS DRAWER MODAL */}
      {isDetailsOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setIsDetailsOpen(false)}>
              <X size={20} />
            </button>
            {detailsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <div>Loading User profile and ratings...</div>
              </div>
            ) : selectedUser ? (
              <div>
                <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 style={{ marginBottom: '0.2rem' }}>{selectedUser.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Mail size={14} /> {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Info size={14} /> About User
                  </h4>
                  <p style={{ lineHeight: 1.5, color: 'var(--text-primary)' }}>{selectedUser.about || 'No description available for this user.'}</p>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    Submitted Ratings ({userDetailRatings.length})
                  </h3>
                  
                  {userDetailRatings.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                      This user hasn't rated any hotels yet.
                    </div>
                  ) : (
                    <div className="ratings-profile-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {userDetailRatings.map((rating) => (
                        <div key={rating.id || rating.ratingId} className="rating-item-card">
                          <div className="rating-hotel-header">
                            <div>
                              <div className="rating-hotel-name">
                                {rating.hotel ? rating.hotel.name : 'Hotel ID: ' + rating.hotelId}
                              </div>
                              {rating.hotel && (
                                <div className="rating-hotel-location">{rating.hotel.location}</div>
                              )}
                            </div>
                            <StarRating rating={rating.rating} />
                          </div>
                          {rating.feedBack && (
                            <p className="rating-text">"{rating.feedBack}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>Failed to load user.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

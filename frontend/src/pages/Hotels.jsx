import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Info, X } from 'lucide-react';
import { api } from '../services/api';

export default function Hotels({ triggerToast }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', about: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editHotelId, setEditHotelId] = useState(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await api.hotels.getAll();
      // Spring returns status 204 with null body if no hotels exist
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading hotels', err);
      triggerToast('Failed to load hotels list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', location: '', about: '' });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (hotel) => {
    setFormData({ name: hotel.name || '', location: hotel.location || '', about: hotel.about || '' });
    setIsEditMode(true);
    setEditHotelId(hotel.id);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      triggerToast('Name and Location are required fields', 'error');
      return;
    }

    try {
      if (isEditMode) {
        await api.hotels.update(editHotelId, formData);
        triggerToast('Hotel updated successfully', 'success');
      } else {
        await api.hotels.create(formData);
        triggerToast('Hotel created successfully', 'success');
      }
      setIsFormOpen(false);
      fetchHotels();
    } catch (err) {
      console.error('Error submitting hotel form', err);
      triggerToast('Operation failed. Please try again.', 'error');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel? Ratings associated with this hotel will remain in the rating database.')) {
      try {
        await api.hotels.delete(hotelId);
        triggerToast('Hotel deleted successfully', 'success');
        fetchHotels();
      } catch (err) {
        console.error('Error deleting hotel', err);
        triggerToast('Failed to delete hotel', 'error');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Manage Hotels</h1>
          <p>Register new hotel entries, manage physical locations, and view description logs.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Add Hotel
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div>Loading Hotels...</div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="card empty-state">
          <h3>No hotels registered yet</h3>
          <p>Click "Add Hotel" to register a new lodging place in the database.</p>
          <button className="btn btn-secondary" onClick={handleOpenCreate}>Add Hotel</button>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Hotel Name</th>
                <th>Location</th>
                <th>About Description</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{hotel.name}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} style={{ color: 'var(--accent-secondary)' }} />
                      {hotel.location}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {hotel.about || 'N/A'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button className="btn-icon" onClick={() => handleOpenEdit(hotel)} title="Edit Hotel">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteHotel(hotel.id)} title="Delete Hotel">
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
              <h2>{isEditMode ? 'Edit Hotel Details' : 'Add New Hotel'}</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Hotel Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter hotel name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter location (e.g. Goa, Delhi)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description / About</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Brief description about the hotel services"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Save Changes' : 'Register Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

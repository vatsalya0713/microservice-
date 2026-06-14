import React, { useEffect, useState } from 'react';
import { Plus, Star, User, Hotel, MessageSquare, X } from 'lucide-react';
import StarRating from '../components/StarRating';
import { api } from '../services/api';

export default function Ratings({ triggerToast }) {
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    hotelId: '',
    rating: 5,
    feedback: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ratingsData, usersData, hotelsData] = await Promise.all([
        api.ratings.getAll().catch(() => []),
        api.users.getAll().catch(() => []),
        api.hotels.getAll().catch(() => []),
      ]);

      setRatings(Array.isArray(ratingsData) ? ratingsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setHotels(Array.isArray(hotelsData) ? hotelsData : []);
    } catch (err) {
      console.error('Error fetching ratings details', err);
      triggerToast('Failed to load ratings logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    if (users.length === 0) {
      triggerToast('Please register at least one user before adding ratings.', 'error');
      return;
    }
    if (hotels.length === 0) {
      triggerToast('Please register at least one hotel before adding ratings.', 'error');
      return;
    }
    setFormData({
      userId: users[0].userId || '',
      hotelId: hotels[0].id || '',
      rating: 5,
      feedback: '',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.hotelId || !formData.rating) {
      triggerToast('User, Hotel and Star Rating are required fields.', 'error');
      return;
    }

    try {
      await api.ratings.create({
        userId: formData.userId,
        hotelId: formData.hotelId,
        rating: formData.rating,
        feedback: formData.feedback,
      });
      triggerToast('Rating submitted successfully!', 'success');
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error creating rating record', err);
      triggerToast('Failed to save rating. Verify services are running.', 'error');
    }
  };

  // Resolve Names for table rendering
  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.name : 'Unknown User';
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Hotel Ratings & Feedback</h1>
          <p>Submit service feedback rating scores and track review histories.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Add Rating
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div>Loading Ratings Data...</div>
        </div>
      ) : ratings.length === 0 ? (
        <div className="card empty-state">
          <h3>No ratings submitted yet</h3>
          <p>Select "Add Rating" to record the first hotel review.</p>
          <button className="btn btn-secondary" onClick={handleOpenCreate}>Add Rating</button>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rater User</th>
                <th>Hotel Rated</th>
                <th>Star Review</th>
                <th>Feedback Comments</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.ratingId}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{getUserName(rating.userId)}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{getHotelName(rating.hotelId)}</span>
                  </td>
                  <td>
                    <StarRating rating={rating.rating} />
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {rating.feedback || 'No comments'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE RATING FORM MODAL */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsFormOpen(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h2>Rate a Hotel</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} /> Select User
                </label>
                <select
                  className="form-control"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                >
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Hotel size={15} /> Select Hotel
                </label>
                <select
                  className="form-control"
                  value={formData.hotelId}
                  onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                  required
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} - {h.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={15} /> Rating Score
                </label>
                <div style={{ padding: '0.5rem 0' }}>
                  <StarRating
                    rating={formData.rating}
                    interactive={true}
                    onChange={(val) => setFormData({ ...formData, rating: val })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={15} /> Feedback Details
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share details of customer experience..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Users, Hotel, Star, Award, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import StarRating from '../components/StarRating';
import { api } from '../services/api';

export default function Dashboard({ triggerToast }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalRatings: 0,
    avgRating: 0.0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentHotels, setRecentHotels] = useState([]);
  const [recentRatings, setRecentRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [users, hotels, ratings] = await Promise.all([
          api.users.getAll().catch(() => []),
          api.hotels.getAll().catch(() => []),
          api.ratings.getAll().catch(() => []),
        ]);

        const uList = Array.isArray(users) ? users : [];
        const hList = Array.isArray(hotels) ? hotels : [];
        const rList = Array.isArray(ratings) ? ratings : [];

        const totalStars = rList.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = rList.length > 0 ? (totalStars / rList.length).toFixed(1) : '0.0';

        setStats({
          totalUsers: uList.length,
          totalHotels: hList.length,
          totalRatings: rList.length,
          avgRating: avg,
        });

        // Set recent activities (take up to 5 elements)
        setRecentUsers(uList.slice(-4).reverse());
        setRecentHotels(hList.slice(-4).reverse());

        // For recent ratings, try to populate User and Hotel names if possible
        const mappedRatings = rList.slice(-4).reverse().map(rating => {
          const u = uList.find(u => u.userId === rating.userId);
          const h = hList.find(h => h.id === rating.hotelId);
          return {
            ...rating,
            userName: u ? u.name : 'Unknown User',
            hotelName: h ? h.name : 'Unknown Hotel',
          };
        });
        setRecentRatings(mappedRatings);
      } catch (err) {
        console.error('Error fetching dashboard statistics', err);
        triggerToast('Failed to load dashboard statistics', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [triggerToast]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Welcome to BillingPro Dashboard</h1>
          <p>Real-time analytics for your Hotel Rating SaaS Microservices.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <StatCard label="Total Hotels" value={stats.totalHotels} icon={Hotel} color="green" />
        <StatCard label="Total Ratings" value={stats.totalRatings} icon={Star} color="amber" />
        <StatCard label="Avg Rating" value={`${stats.avgRating} / 5.0`} icon={Award} color="blue" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Recent Ratings Card */}
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            <TrendingUp size={20} style={{ color: 'var(--accent-secondary)' }} />
            Recent User Ratings
          </h2>
          {recentRatings.length === 0 ? (
            <div className="empty-state">No ratings submitted yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentRatings.map((rating) => (
                <div key={rating.ratingId} className="rating-item-card" style={{ padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rating.userName}</span>
                    <StarRating rating={rating.rating} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Rated <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{rating.hotelName}</span>
                  </div>
                  {rating.feedback && (
                    <p className="rating-text" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      "{rating.feedback}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Summary Quick view list */}
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            <Users size={20} style={{ color: 'var(--accent-primary)' }} />
            Recently Registered Users
          </h2>
          {recentUsers.length === 0 ? (
            <div className="empty-state">No users registered yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentUsers.map((user) => (
                <div key={user.userId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{user.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

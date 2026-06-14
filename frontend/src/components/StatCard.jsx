import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'blue' }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

import React from 'react';
import { LayoutDashboard, Users, Hotel, Star } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'ratings', label: 'Ratings', icon: Star },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <Hotel size={28} className="logo-icon" style={{ stroke: 'url(#logo-grad)' }} />
        <span>BillingPro</span>
        {/* SVG Gradient definition for lucide icon gradient fill/stroke */}
        <svg width="0" height="0">
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </svg>
      </div>
      
      <nav>
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <a
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

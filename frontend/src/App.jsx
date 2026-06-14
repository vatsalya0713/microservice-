import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Hotels from './pages/Hotels';
import Ratings from './pages/Ratings';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard triggerToast={triggerToast} />;
      case 'users':
        return <Users triggerToast={triggerToast} />;
      case 'hotels':
        return <Hotels triggerToast={triggerToast} />;
      case 'ratings':
        return <Ratings triggerToast={triggerToast} />;
      default:
        return <Dashboard triggerToast={triggerToast} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {renderActivePage()}
      </main>

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
}

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert-toast ${type}`}>
      {type === 'success' ? (
        <CheckCircle2 size={20} className="alert-icon" style={{ color: 'var(--accent-secondary)' }} />
      ) : (
        <AlertCircle size={20} className="alert-icon" style={{ color: 'var(--accent-danger)' }} />
      )}
      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'var(--text-secondary)',
          display: 'flex',
          marginLeft: '0.5rem'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

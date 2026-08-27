import React from 'react';
import './AdminTopbar.css';

const AdminTopbar = () => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {/* Mobile menu toggle space compensation */}
        <div className="mobile-spacer"></div>
      </div>
      
      <div className="admin-topbar-right">
        <div className="admin-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search..." />
        </div>
        
        <button className="admin-notification-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className="notification-badge"></span>
        </button>
        
        <div className="admin-profile">
          <div className="admin-profile-avatar">
            A
          </div>
          <div className="admin-profile-info">
            <span className="admin-name">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

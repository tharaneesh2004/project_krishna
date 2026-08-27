import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from './utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminApi.getDashboard();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

  // Formatting helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <div className="admin-header-actions">
          <Link to="/admin/products/add" className="admin-btn-primary">
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          </div>
          <div className="stat-details">
            <h3>TOTAL PRODUCTS</h3>
            <p className="stat-value">{stats?.totalProducts || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon categories">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <div className="stat-details">
            <h3>CATEGORIES</h3>
            <p className="stat-value">{stats?.totalCategories || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div className="stat-details">
            <h3>TOTAL ORDERS</h3>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sales">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className="stat-details">
            <h3>TOTAL SALES</h3>
            <p className="stat-value">{formatCurrency(stats?.totalSales)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="card-link">View All</Link>
          </div>
          <div className="card-body p-0">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order.orderId}</td>
                      <td>{order.customer.name}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state-small">No recent orders found.</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Low Stock Alerts</h3>
            <Link to="/admin/products" className="card-link">Manage Inventory</Link>
          </div>
          <div className="card-body p-0">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <ul className="low-stock-list">
                {stats.lowStockProducts.map(product => (
                  <li key={product._id} className="low-stock-item">
                    <div className="item-info">
                      <span className="item-name">{product.name}</span>
                      <span className="item-sku">{product.sku || 'No SKU'}</span>
                    </div>
                    <div className="item-stock">
                      <span className="stock-label">Stock:</span>
                      <span className={`stock-value ${product.stock === 0 ? 'critical' : 'warning'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state-small">Inventory is healthy.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

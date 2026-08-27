import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const userData = localStorage.getItem('customerData');
    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="profile-card">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <h3>{user.name}</h3>
            <p>Welcome back!</p>
            <div className="gold-badge">♛ Gold Member</div>
          </div>
          
          <nav className="sidebar-nav">
            <a href="#" className="active">Dashboard</a>
            <a href="#">My Orders</a>
            <a href="#">Wishlist <span className="badge">1</span></a>
            <a href="#">Addresses <span className="badge">1</span></a>
            <a href="#">Payment Methods</a>
            <a href="#">Help Center</a>
          </nav>
          
          <div className="sidebar-bottom">
            <button className="btn-outline">Continue Shopping</button>
            <button className="btn-outline btn-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2>My Dashboard</h2>
              <p>A premium, elegant customer dashboard</p>
            </div>
            <div className="floral-ornament"></div>
          </div>
          
          <div className="summary-cards">
            <div className="card"><span className="icon">📋</span> <div><strong>5</strong><p>Total Orders</p></div></div>
            <div className="card"><span className="icon">🕒</span> <div><strong>5</strong><p>Pending Orders</p></div></div>
            <div className="card"><span className="icon">📍</span> <div><strong>5</strong><p>Saved Addresses</p></div></div>
            <div className="card"><span className="icon">❤️</span> <div><strong>5</strong><p>Wishlist Items</p></div></div>
            <div className="card"><span className="icon">🎟️</span> <div><strong>5</strong><p>Coupons</p></div></div>
          </div>
          
          <div className="dashboard-grid">
            <div className="recent-orders">
              <h3>Recent Orders</h3>
              <div className="order-list">
                <div className="order-item">
                  <div className="order-img red-saree"></div>
                  <div className="order-details">
                    <h4>Red Saree</h4>
                    <p>Status: ₹230.00</p>
                  </div>
                  <div className="status status-processing">Status</div>
                  <button className="btn-view">View Details</button>
                </div>
                <div className="order-item">
                  <div className="order-img green-saree"></div>
                  <div className="order-details">
                    <h4>Green Lawn Saree</h4>
                    <p>Status: ₹370.00</p>
                  </div>
                  <div className="status status-delivered">Placed</div>
                  <button className="btn-view">View Details</button>
                </div>
              </div>
            </div>
            
            <div className="quick-actions-container">
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button>📋 Total orders</button>
                  <button>🕒 Pending orders</button>
                  <button>⇄ Quick Actions</button>
                  <button>❤️ Wishlist orders</button>
                  <button>📍 Saved status</button>
                  <button>🎟️ Coupons</button>
                </div>
              </div>
              
              <div className="promo-banner">
                <h3>Exclusive for You - Gold Member</h3>
                <p>Get your preclusive for you - Gold Member.</p>
                <button className="btn-gold">Gold Member</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerDashboard;

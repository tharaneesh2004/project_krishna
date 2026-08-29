import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || 'Password reset link sent to your email.');
        setEmail('');
      } else {
        setError(data.message || 'Failed to process request.');
      }
    } catch (err) {
      setError('An error occurred connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-login-container" style={{ minHeight: '100vh', background: '#FAF9F6' }}>
        <div className="admin-login-card" style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div className="admin-login-header">
            <h2 className="admin-brand-name">KRISHNA</h2>
            <p className="admin-brand-tagline">HERITAGE</p>
            <div className="admin-brand-divider">
              <span></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8935a" strokeWidth="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span></span>
            </div>
            <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Enter your email to receive a password reset link.</p>
          </div>
          
          {error && <div className="admin-login-error">{error}</div>}
          {message && <div style={{ background: '#e6f3e6', color: '#2e7d32', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email address"
              />
            </div>
            
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#666' }}>
            Remembered your password? <Link to="/login" style={{ color: '#b8935a', fontWeight: '500', textDecoration: 'none' }}>Log in here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;

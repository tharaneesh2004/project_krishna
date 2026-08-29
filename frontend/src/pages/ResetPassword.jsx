import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Login.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid or missing password reset token.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message || 'Password successfully updated! You can now log in.');
        navigate('/login');
      } else {
        setError(data.message || 'Failed to update password.');
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
            <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Choose a new password</p>
          </div>
          
          {error && <div className="admin-login-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                minLength="6"
              />
            </div>
            
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'UPDATING...' : 'RESET PASSWORD'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;

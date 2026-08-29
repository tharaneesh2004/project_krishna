import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setToken as setAdminToken } from '../admin/utils/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.isAdmin) {
          setAdminToken(data.token);
          navigate('/admin/dashboard');
        } else {
          localStorage.setItem('customerToken', data.token);
          localStorage.setItem('customerData', JSON.stringify(data.user));
          window.location.href = 'http://localhost:3000/dashboard.html';
        }
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred connecting to the server. Please try again.');
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
            <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Sign in to your account</p>
          </div>
          
          {error && <div className="admin-login-error">{error}</div>}
          
          <form onSubmit={handleLogin} className="admin-login-form">
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
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="form-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ color: '#b8935a', fontSize: '0.9rem', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#666' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#b8935a', fontWeight: '500', textDecoration: 'none' }}>Create one here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

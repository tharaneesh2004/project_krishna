import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Signup.css'; // Reusing some base styles

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/public/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('customerData', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <div className="signup-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Your Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            
            <button type="submit" className="btn-signup">Sign In</button>
          </form>
          
          <p className="login-link">Don't have an account? <Link to="/signup">Create one here</Link></p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!formData.mobile) {
      setError('Please enter your mobile number.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/public/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setError('');
        // We log it just in case, simulated SMS
        console.log("OTP Sent:", data.otpCode);
        alert(`Simulated OTP sent: ${data.otpCode}`);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setError('Please enter the OTP.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/public/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile, otp: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        setError('');
        alert('OTP Verified successfully!');
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError('Please verify your mobile number first.');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/public/signup', {
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
        setError(data.message || 'Signup failed.');
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
          <h2>Create an Account</h2>
          <p className="subtitle">Join Krishna Heritage Collection</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={otpVerified} />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={otpVerified} />
            </div>
            
            <div className="form-group mobile-group">
              <label>Mobile Number</label>
              <div className="mobile-input-wrapper">
                <input type="text" placeholder="10-digit mobile number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required disabled={otpSent || otpVerified} />
                {!otpVerified && (
                  <button type="button" className="btn-send-otp" onClick={handleSendOtp} disabled={otpSent}>
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {otpSent && !otpVerified && (
              <div className="form-group otp-group">
                <label>Enter OTP</label>
                <div className="otp-input-wrapper">
                  <input type="text" placeholder="6-digit OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} required />
                  <button type="button" className="btn-verify-otp" onClick={handleVerifyOtp}>Verify</button>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required disabled={!otpVerified} />
            </div>
            
            <button type="submit" className="btn-signup" disabled={!otpVerified}>Create Account</button>
          </form>
          
          <p className="login-link">Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;

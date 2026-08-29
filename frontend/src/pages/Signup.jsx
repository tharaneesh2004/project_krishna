import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import foldedSaree from '../assets/images/folded_maroon_saree.jpg';
import hangingSarees from '../assets/images/hanging_sarees_boutique.jpg';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!otpVerified) {
      setError('Please verify your email with OTP first.');
      return;
    }
    
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        })
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

  const handleSendOtp = async () => {
    if (!formData.email) {
      setOtpMessage('Please enter email first.');
      return;
    }
    setLoadingOtp(true);
    setOtpMessage('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpMessage('OTP sent! Check your email.');
      } else {
        setOtpMessage(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setOtpMessage('Error sending OTP.');
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!emailOtp) {
      setOtpMessage('Please enter OTP.');
      return;
    }
    setLoadingOtp(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: emailOtp })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        setOtpMessage('Email verified successfully!');
      } else {
        setOtpMessage(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setOtpMessage('Error verifying OTP.');
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar />
      
      <main className="signup-layout">
        {/* LEFT SECTION (34%) */}
        <section className="signup-left">
          <div className="left-content-wrapper">
            <div className="brand-header">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B88A45" strokeWidth="1.5" className="logo-icon">
                {/* Elegant gold floral logo icon */}
                <path d="M12 2C8 6 4 10 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 10 16 6 12 2Z" fill="rgba(184, 138, 69, 0.1)"></path>
                <path d="M12 22V10M12 10C9 10 7 12 7 14M12 10C15 10 17 12 17 14"></path>
              </svg>
              <div className="brand-text">
                <h1>Krishna</h1>
                <p>HERITAGE COLLECTION</p>
              </div>
            </div>

            <h2 className="promo-headline">
              Create your<br />account
            </h2>
            <p className="promo-subheadline">
              and begin your journey<br />into timeless saree elegance.
            </p>

            <div className="decorative-divider">
              <span className="line"></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B88A45" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="line"></span>
            </div>

            <ul className="benefit-list">
              <li>
                <div className="icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B88A45" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8C12 8 16 8 16 12C16 16 12 16 12 16C12 16 8 16 8 12C8 8 12 8 12 8Z"/></svg>
                </div>
                <span>Discover exclusive<br />saree collections</span>
              </li>
              <li>
                <div className="icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B88A45" strokeWidth="1.5"><path d="M20.84 4.61A5.5 5.5 0 0013.06 4.61L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
                </div>
                <span>Save your favorites<br />and wishlist</span>
              </li>
              <li>
                <div className="icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B88A45" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                </div>
                <span>Enjoy special offers<br />and early access</span>
              </li>
            </ul>
          </div>
          <div className="left-image-container">
            <img src={foldedSaree} alt="Maroon Silk Saree" />
          </div>
        </section>

        {/* CENTER SECTION (40%) */}
        <section className="signup-center">
          <div className="signup-card">
            <div className="card-top-divider">
              <span className="line"></span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B88A45" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="line"></span>
            </div>

            <h2 className="card-title">Sign Up</h2>
            <p className="card-subtitle">Join Krishna Heritage Collection</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSignup} className="signup-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" placeholder="Enter your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper with-action">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" placeholder="Enter your email address" value={formData.email} onChange={e => {setFormData({...formData, email: e.target.value}); setOtpVerified(false); setOtpSent(false); setOtpMessage('');}} disabled={otpVerified} required />
                  {!otpVerified && (
                    <button type="button" className="action-btn" onClick={handleSendOtp} disabled={loadingOtp || !formData.email}>
                      {loadingOtp ? 'Sending...' : (otpSent ? 'Resend' : 'Send OTP')}
                    </button>
                  )}
                  {otpVerified && <span className="verified-badge">Verified ✓</span>}
                </div>
                {otpSent && !otpVerified && (
                  <div className="input-wrapper with-action otp-input">
                    <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="text" placeholder="Enter OTP" value={emailOtp} onChange={e => setEmailOtp(e.target.value)} required />
                    <button type="button" className="action-btn" onClick={handleVerifyOtp} disabled={loadingOtp || !emailOtp}>
                      Verify
                    </button>
                  </div>
                )}
                {otpMessage && <div className={`otp-msg ${otpVerified ? 'success' : 'error'}`}>{otpMessage}</div>}
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-wrapper phone-input">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span className="country-code">+91</span>
                  <input type="tel" placeholder="Enter your mobile number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                  <svg className="eye-icon" onClick={() => setShowPassword(!showPassword)} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {showPassword ? (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                    ) : (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                    )}
                  </svg>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                  <svg className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {showConfirmPassword ? (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                    ) : (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                    )}
                  </svg>
                </div>
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the <span className="highlight">Terms & Conditions</span> and <span className="highlight">Privacy Policy</span></label>
              </div>

              <button type="submit" className="submit-btn">Create Account</button>

              <div className="social-divider">
                <span className="line"></span>
                <span className="text">or sign up with</span>
                <span className="line"></span>
              </div>

              <div className="social-buttons">
                <button type="button" className="social-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="social-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#1877F2"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
                  Facebook
                </button>
                <button type="button" className="social-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path d="M17.05 13.56c-.02-2.18 1.81-3.23 1.9-3.28-1.02-1.47-2.63-1.68-3.2-1.71-1.35-.14-2.66.79-3.35.79-.69 0-1.78-.77-2.9-.75-1.5.02-2.89.87-3.66 2.21-1.55 2.67-.4 6.6 1.1 8.76.73 1.05 1.58 2.2 2.7 2.16 1.08-.04 1.5-.7 2.78-.7 1.28 0 1.66.7 2.79.68 1.15-.02 1.89-1.06 2.62-2.12.83-1.2 1.17-2.37 1.19-2.43-.02-.01-2.27-.86-2.28-3.41zM14.99 7.42c.62-.74 1.03-1.77.91-2.8-.88.04-1.97.59-2.61 1.33-.56.64-1.05 1.7-.91 2.7 1 .07 2.01-.48 2.61-1.23z"/></svg>
                  Apple
                </button>
              </div>

              <div className="login-link">
                Already have an account? <Link to="/login" className="highlight">Login</Link>
              </div>
            </form>
          </div>
        </section>

        {/* RIGHT SECTION (26%) */}
        <section className="signup-right">
          <img src={hangingSarees} alt="Boutique Sarees" className="boutique-bg" />
        </section>
      </main>

      {/* CUSTOM FOOTER STRIP */}
      <footer className="signup-footer-strip">
        <div className="feature">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Secure Shopping</span>
        </div>
        <div className="divider"></div>
        <div className="feature">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>Handpicked Collections</span>
        </div>
        <div className="divider"></div>
        <div className="feature">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          <span>Premium Quality</span>
        </div>
        <div className="divider"></div>
        <div className="feature">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
          <span>Easy Returns</span>
        </div>
      </footer>
    </div>
  );
};

export default Signup;

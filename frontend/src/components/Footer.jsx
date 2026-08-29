import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>KRISHNA</h2>
            <p className="footer-tagline">Timeless Drapes. Modern Grace.</p>
            <p className="footer-desc">Celebrating the art of Indian weaving, one saree at a time.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">Home</a>
            <a href="#">Sarees</a>
            <a href="#">Collections</a>
            <a href="#">About Us</a>
          </div>
          <div className="footer-links">
            <h4>Customer Care</h4>
            <a href="#">Contact Us</a>
            <a href="#">Shipping Info</a>
            <Link to="/track-order">Track Order</Link>
            <a href="#">Returns & Exchange</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Pinterest</a>
            <a href="#">WhatsApp</a>
          </div>
        </div>
        <div className="footer-bottom-content">
          <p>&copy; 2026 Krishna Heritage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

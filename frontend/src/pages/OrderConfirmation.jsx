import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  // We can fetch order details from backend if we have a GET endpoint, 
  // but for now we just show a successful state based on the ID.

  return (
    <>
      <Navbar />
      <div className="order-confirmation-container">
        <div className="confirmation-card">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b8935a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="confirmation-title">Order Placed Successfully</h1>
          <p className="confirmation-subtitle">Thank you for your purchase!</p>
          
          <div className="order-details-box">
            <p><strong>Order ID:</strong> #{orderId}</p>
            <p><strong>Estimated Delivery:</strong> 3–5 Business Days</p>
          </div>

          <div className="confirmation-actions">
            <button className="btn btn-outline" onClick={() => alert('Tracking feature coming soon!')}>TRACK ORDER</button>
            <button className="btn btn-gold" onClick={() => navigate('/collections/all')}>CONTINUE SHOPPING</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;

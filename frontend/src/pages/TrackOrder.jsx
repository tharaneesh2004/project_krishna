import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TrackOrder.css';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, contact })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderData(data);
      } else {
        setError(data.message || 'Failed to track order. Please check your details.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timelineSteps = [
    { status: 'Pending', label: 'Order Placed', message: 'Your order has been placed.' },
    { status: 'Confirmed', label: 'Order Confirmed', message: 'Your order has been confirmed by the seller.' },
    { status: 'Processing', label: 'Packed', message: 'Your saree has been packed.' },
    { status: 'Shipped', label: 'Shipped', message: 'Your order is on the way.' },
    { status: 'In Transit', label: 'In Transit', message: 'Your order has arrived at the local hub.' },
    { status: 'Out for Delivery', label: 'Out for Delivery', message: 'Your order is out for delivery.' },
    { status: 'Delivered', label: 'Delivered', message: 'Your order has been delivered.' }
  ];

  // Helper to determine active step index based on backend status
  const getActiveStepIndex = (currentStatus) => {
    const statusMap = {
      'Pending': 0,
      'Confirmed': 1,
      'Processing': 2,
      'Shipped': 3,
      'In Transit': 4,
      'Out for Delivery': 5,
      'Delivered': 6
    };
    
    if (currentStatus === 'Cancelled') return -1;
    return statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;
  };

  const activeIndex = orderData ? getActiveStepIndex(orderData.orderStatus) : 0;

  return (
    <>
      <Navbar />
      <div className="track-order-page">
        <div className="track-header">
          <h1>Track Your Order</h1>
          <p>Enter your Order ID and Contact details to get real-time updates.</p>
        </div>

        <div className="track-container">
          <form className="track-form" onSubmit={handleTrackOrder}>
            <div className="form-group">
              <label>Order ID</label>
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="e.g. ORD-123456" 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address or Mobile Number</label>
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input 
                  type="text" 
                  placeholder="Enter contact info used for order" 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? 'TRACKING...' : 'TRACK ORDER'}
            </button>
            {error && <div className="track-error">{error}</div>}
          </form>

          {orderData && (
            <div className="track-results fade-in">
              <div className="order-summary-card">
                <h3>Order Details</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>Order ID:</span>
                    <strong>{orderData.orderId}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Order Date:</span>
                    <strong>{new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Total Amount:</span>
                    <strong>${orderData.total.toFixed(2)}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Payment Status:</span>
                    <strong className={`payment-status ${orderData.paymentStatus.toLowerCase()}`}>{orderData.paymentStatus}</strong>
                  </div>
                </div>

                <div className="product-details-list">
                  <h4>Items in this Order</h4>
                  {orderData.products.map((item, idx) => (
                    <div key={idx} className="product-row">
                      <div className="product-image">
                        {item.product && item.product.images && item.product.images.length > 0 ? (
                          <img src={item.product.images[0]} alt={item.product.name} />
                        ) : (
                          <div className="img-placeholder">Image</div>
                        )}
                      </div>
                      <div className="product-info">
                        <h5>{item.product ? item.product.name : 'Unknown Product'}</h5>
                        <p>Qty: {item.quantity} | Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="shipping-info">
                  <h4>Delivery Address</h4>
                  <p>{orderData.customer.name}</p>
                  <p>{orderData.shippingAddress.address}, {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.pincode}</p>
                </div>
              </div>

              <div className="timeline-card">
                <h3>Delivery Status</h3>
                
                {orderData.orderStatus === 'Cancelled' ? (
                  <div className="cancelled-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    <h4>Order Cancelled</h4>
                    <p>This order has been cancelled and will not be delivered.</p>
                  </div>
                ) : (
                  <div className="timeline">
                    {timelineSteps.map((step, idx) => {
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;
                      
                      return (
                        <div key={idx} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                          <div className="timeline-icon">
                            {isCompleted ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                              <div className="dot"></div>
                            )}
                          </div>
                          <div className="timeline-content">
                            <h4>{step.label}</h4>
                            {isCompleted && <p>{step.message}</p>}
                            {isCurrent && <span className="current-badge">Current Status</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from './utils/api';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await fetch(`/api/admin/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }).then(res => res.json());
        setOrder(data);
        setNewStatus(data.orderStatus);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      setOrder(prev => ({ ...prev, orderStatus: newStatus }));
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading Order Details...</div>;
  if (!order) return <div className="admin-alert error">Order not found</div>;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="admin-order-detail">
      <div className="admin-page-header">
        <div className="header-title-group">
          <Link to="/admin/orders" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Orders
          </Link>
          <h1 className="admin-page-title">Order #{order.orderId}</h1>
          <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
        </div>
        <p className="order-date">{formatDate(order.createdAt)}</p>
      </div>

      <div className="order-grid">
        <div className="order-main">
          <div className="admin-card order-products-card">
            <h3>Ordered Products</h3>
            <div className="order-products-list">
              {order.products.map((item, index) => (
                <div className="order-product-item" key={index}>
                  <div className="product-image">
                    {item.product?.primaryImage ? (
                      <img src={item.product.primaryImage} alt={item.product.name} />
                    ) : (
                      <div className="placeholder-img">No Img</div>
                    )}
                  </div>
                  <div className="product-details">
                    <h4>{item.product?.name || 'Deleted Product'}</h4>
                    <p className="product-meta">Category: {item.product?.category}</p>
                    <div className="product-price-row">
                      <span className="qty">Qty: {item.quantity}</span>
                      <span className="price">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total Amount</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-sidebar">
          <div className="admin-card">
            <h3>Update Status</h3>
            <div className="status-update-section">
              <div className="form-group">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button 
                className="admin-btn-primary w-100" 
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.orderStatus}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <div className="admin-card customer-info-card">
            <h3>Customer Details</h3>
            <div className="info-block">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="info-text">
                <p className="info-value">{order.customer.name}</p>
                <p className="info-label">{order.customer.email}</p>
                <p className="info-label">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="admin-card customer-info-card">
            <h3>Shipping Address</h3>
            <div className="info-block">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div className="info-text">
                <p className="info-value address-text">{order.shippingAddress}</p>
              </div>
            </div>
          </div>
          
          <div className="admin-card customer-info-card">
            <h3>Payment Information</h3>
            <div className="info-block">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </div>
              <div className="info-text">
                <p className="info-label">Payment Status</p>
                <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

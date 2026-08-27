import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CustomerView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we'll fetch mock customer data if the actual API doesn't exist
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/admin/customers/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          // Mock data for presentation
          setData({
            customer: {
              name: 'Demo Customer',
              email: 'customer@example.com',
              phone: '+91 98765 43210',
              totalOrders: 3,
              totalSpending: 45000,
              createdAt: new Date().toISOString()
            },
            orders: []
          });
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div className="admin-loading">Loading Customer...</div>;

  return (
    <div className="admin-customer-view">
      <div className="admin-page-header">
        <div className="header-title-group">
          <Link to="/admin/dashboard" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </Link>
          <h1 className="admin-page-title">Customer Profile</h1>
        </div>
      </div>

      <div className="order-grid">
        <div className="admin-card">
          <h3>Customer Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', paddingBottom: '0.75rem' }}>
              <span style={{ color: '#7a6a58', fontSize: '0.9rem' }}>Name</span>
              <span style={{ color: '#2d2d2d', fontWeight: '500' }}>{data?.customer.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', paddingBottom: '0.75rem' }}>
              <span style={{ color: '#7a6a58', fontSize: '0.9rem' }}>Email</span>
              <span style={{ color: '#2d2d2d', fontWeight: '500' }}>{data?.customer.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', paddingBottom: '0.75rem' }}>
              <span style={{ color: '#7a6a58', fontSize: '0.9rem' }}>Phone</span>
              <span style={{ color: '#2d2d2d', fontWeight: '500' }}>{data?.customer.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', paddingBottom: '0.75rem' }}>
              <span style={{ color: '#7a6a58', fontSize: '0.9rem' }}>Total Orders</span>
              <span style={{ color: '#C49A4A', fontWeight: 'bold', fontSize: '1.1rem' }}>{data?.customer.totalOrders}</span>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <h3>Order History</h3>
          {data?.orders && data.orders.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order.orderId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-small">No orders found for this customer.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;

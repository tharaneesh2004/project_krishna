import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Cart.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { cartItems, subtotal, loading, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-container loading">
          <h2>Loading your cart...</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is currently empty.</p>
            <button className="btn btn-gold" onClick={() => navigate('/collections/all')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map(item => {
                const product = item.product;
                const mainImg = product.primaryImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg');
                return (
                  <div key={item._id} className="cart-item">
                    <img src={mainImg} alt={product.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{product.name}</h3>
                      <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(product._id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(product._id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(product._id)}>Remove</button>
                    </div>
                    <div className="cart-item-total">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <button className="btn btn-gold checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;

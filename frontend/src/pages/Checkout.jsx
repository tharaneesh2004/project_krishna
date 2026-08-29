import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Checkout.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const { sessionId, clearCartState, cartItems, subtotal: cartSubtotal } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [checkoutMode, setCheckoutMode] = useState(''); // 'cart' or 'buynow'
  const [orderProduct, setOrderProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
    billingSameAsShipping: true
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculate totals
  const subtotal = checkoutMode === 'buynow' && orderProduct 
    ? orderProduct.price * orderProduct.quantity 
    : cartSubtotal;
    
  const shippingCharge = deliveryMethod === 'Express' ? 150 : 0;
  const total = subtotal + shippingCharge;

  useEffect(() => {
    // Determine checkout mode
    const buyNowProductJson = localStorage.getItem('buyNowProduct');
    if (buyNowProductJson) {
      try {
        const product = JSON.parse(buyNowProductJson);
        setOrderProduct(product);
        setCheckoutMode('buynow');
      } catch(e) {
        console.error('Failed to parse buyNowProduct', e);
        checkCartFallback();
      }
    } else {
      checkCartFallback();
    }
  }, [cartItems, navigate]);

  const checkCartFallback = () => {
    if (cartItems.length > 0) {
      setCheckoutMode('cart');
    } else {
      // Nothing to checkout
      navigate('/collections/all');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all required fields.');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const placeOrder = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      let endpoint = '/api/checkout';
      let payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        deliveryMethod,
        paymentMethod
      };

      if (checkoutMode === 'buynow' && orderProduct) {
        endpoint = '/api/checkout/buynow';
        payload.productId = orderProduct.productId;
        payload.quantity = orderProduct.quantity;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (checkoutMode === 'cart') {
          clearCartState();
        } else {
          localStorage.removeItem('buyNowProduct');
        }
        navigate(`/order-confirmation/${data.orderId}`);
      } else {
        setError(data.message || 'Checkout failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };

  if (!checkoutMode) return <div style={{padding: '10rem', textAlign: 'center'}}>Loading checkout...</div>;

  return (
    <div className="checkout-page-wrapper">
      <Navbar />
      
      <div className="checkout-main">
        {/* Progress Indicator */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Shipping</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Delivery</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Payment</div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Confirm</div>
        </div>

        <div className="checkout-container">
          
          {/* LEFT: Checkout Forms */}
          <div className="checkout-form-section">
            {error && <div className="checkout-error">{error}</div>}

            {step === 1 && (
              <div className="checkout-step-content animate-fade-in">
                <h2 className="checkout-title">Shipping Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input type="tel" name="altPhone" value={formData.altPhone} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Shipping Address *</label>
                  <textarea name="address" rows="3" value={formData.address} onChange={handleChange} required></textarea>
                </div>
                <div className="form-row triple">
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select name="state" value={formData.state} onChange={handleChange} required>
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" id="billingSame" name="billingSameAsShipping" checked={formData.billingSameAsShipping} onChange={handleChange} />
                  <label htmlFor="billingSame">Use this address as my billing address</label>
                </div>
                
                <button className="btn btn-gold checkout-next-btn" onClick={nextStep}>Continue to Delivery</button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-step-content animate-fade-in">
                <h2 className="checkout-title">Delivery Method</h2>
                
                <div className={`delivery-option ${deliveryMethod === 'Standard' ? 'selected' : ''}`} onClick={() => setDeliveryMethod('Standard')}>
                  <div className="radio-circle">
                    {deliveryMethod === 'Standard' && <div className="inner-circle"></div>}
                  </div>
                  <div className="delivery-info">
                    <h4>Standard Delivery</h4>
                    <p>Estimated delivery: 3-5 days</p>
                  </div>
                  <div className="delivery-price">FREE</div>
                </div>

                <div className={`delivery-option ${deliveryMethod === 'Express' ? 'selected' : ''}`} onClick={() => setDeliveryMethod('Express')}>
                  <div className="radio-circle">
                    {deliveryMethod === 'Express' && <div className="inner-circle"></div>}
                  </div>
                  <div className="delivery-info">
                    <h4>Express Delivery</h4>
                    <p>Estimated delivery: 1-2 days</p>
                  </div>
                  <div className="delivery-price">₹150</div>
                </div>

                <div className="step-actions">
                  <button className="btn btn-outline" onClick={prevStep}>Back</button>
                  <button className="btn btn-gold checkout-next-btn" onClick={nextStep}>Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-step-content animate-fade-in">
                <h2 className="checkout-title">Payment Method</h2>
                
                <div className="payment-options">
                  {['Razorpay', 'UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                    <div 
                      key={method}
                      className={`payment-option ${paymentMethod === method ? 'selected' : ''}`} 
                      onClick={() => setPaymentMethod(method)}
                    >
                      <div className="radio-circle">
                        {paymentMethod === method && <div className="inner-circle"></div>}
                      </div>
                      <span className="payment-name">{method}</span>
                    </div>
                  ))}
                </div>

                <div className="step-actions">
                  <button className="btn btn-outline" onClick={prevStep}>Back</button>
                  <button 
                    className="btn btn-gold checkout-next-btn" 
                    onClick={placeOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'PROCESSING...' : `PAY ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="checkout-summary-section">
            <h2 className="checkout-title">Order Summary</h2>
            
            <div className="summary-items">
              {checkoutMode === 'buynow' && orderProduct && (
                <div className="summary-item card-style">
                  <img src={orderProduct.image} alt={orderProduct.name} className="summary-item-img" />
                  <div className="summary-item-details">
                    <h4>{orderProduct.name}</h4>
                    <p className="summary-qty">Qty: {orderProduct.quantity}</p>
                    <p className="summary-item-price">₹{orderProduct.price.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {checkoutMode === 'cart' && cartItems.map(item => {
                const img = item.product.primaryImage || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/images/placeholder.jpg');
                return (
                  <div key={item.product._id} className="summary-item card-style">
                    <img src={img} alt={item.product.name} className="summary-item-img" />
                    <div className="summary-item-details">
                      <h4>{item.product.name}</h4>
                      <p className="summary-qty">Qty: {item.quantity}</p>
                      <p className="summary-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="summary-totals-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Charges</span>
                <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
              </div>
              <div className="summary-row discount">
                <span>Discount</span>
                <span>- ₹0</span>
              </div>
              
              <div className="summary-total-row">
                <span>TOTAL</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

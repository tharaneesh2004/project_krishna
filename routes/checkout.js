const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Process Checkout
router.post('/', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    const { customerName, customerEmail, customerPhone, shippingAddress } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'All customer and shipping details are required' });
    }

    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty or not found' });
    }

    // Prepare products for the order
    const orderProducts = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      discount: item.product.discountPercentage || 0
    }));

    const newOrder = new Order({
      orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      shippingAddress: shippingAddress,
      products: orderProducts,
      subtotal: cart.subtotal,
      shipping: 0, // Free shipping for now or can be calculated
      total: cart.subtotal,
      paymentStatus: 'Paid', // Simulating successful payment for now
      orderStatus: 'Confirmed'
    });

    await newOrder.save();

    // Clear the cart
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();

    res.json({ success: true, message: 'Order placed successfully', orderId: newOrder.orderId });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error during checkout' });
  }
});

// Single Product Buy Now Checkout
router.post('/buynow', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, deliveryMethod, paymentMethod, productId, quantity } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'All required customer and shipping details are missing' });
    }

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product information' });
    }

    // Verify product securely from database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock for this product' });
    }

    const price = product.discountedPrice || product.originalPrice;
    const subtotal = price * quantity;
    const shippingCharge = deliveryMethod === 'Express' ? 150 : 0;
    const total = subtotal + shippingCharge;

    const newOrder = new Order({
      orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      shippingAddress: shippingAddress,
      deliveryMethod: deliveryMethod || 'Standard',
      paymentMethod: paymentMethod || 'Online',
      products: [{
        product: product._id,
        quantity: quantity,
        price: price,
        discount: product.discountPercentage || 0
      }],
      subtotal: subtotal,
      shipping: shippingCharge,
      total: total,
      paymentStatus: 'Paid', // Simulating successful payment for now
      orderStatus: 'Confirmed'
    });

    await newOrder.save();

    res.json({ success: true, message: 'Order placed successfully', orderId: newOrder.orderId, totalAmount: total });

  } catch (error) {
    console.error('Buy Now Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error during checkout' });
  }
});

module.exports = router;

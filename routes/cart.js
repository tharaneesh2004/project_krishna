const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

// Middleware to ensure a session ID exists
const ensureSessionId = (req, res, next) => {
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Session ID is required in x-session-id header' });
  }
  req.sessionId = sessionId;
  next();
};

// Generate a new session ID for frontend to use
router.get('/session', (req, res) => {
  res.json({ success: true, sessionId: uuidv4() });
});

// Get current cart
router.get('/', ensureSessionId, async (req, res) => {
  try {
    let cart = await Cart.findOne({ sessionId: req.sessionId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ sessionId: req.sessionId, items: [], subtotal: 0 });
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Add item to cart
router.post('/add', ensureSessionId, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ sessionId: req.sessionId });
    if (!cart) {
      cart = new Cart({ sessionId: req.sessionId, items: [] });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ 
        product: productId, 
        quantity, 
        price: product.discountedPrice || product.originalPrice 
      });
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart, message: 'Added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update item quantity
router.post('/update', ensureSessionId, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ sessionId: req.sessionId });
    
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      await cart.populate('items.product');
      res.json({ success: true, cart });
    } else {
      res.status(404).json({ success: false, message: 'Item not in cart' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', ensureSessionId, async (req, res) => {
  try {
    let cart = await Cart.findOne({ sessionId: req.sessionId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Get a single customer with their order history
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    // Find orders for this customer (assuming we match by email for now)
    const orders = await Order.find({ 'customer.email': customer.email }).sort({ createdAt: -1 });
    
    res.json({ customer, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const totalCustomers = await Customer.countDocuments();
    
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).limit(5);

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalSales,
      recentOrders,
      lowStockProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

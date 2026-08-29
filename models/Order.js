const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  deliveryMethod: { type: String, default: 'Standard' },
  paymentMethod: { type: String, default: 'Online' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

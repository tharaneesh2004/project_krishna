const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true } // Price at the time of adding to cart
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // For guest carts
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to calculate subtotal
cartSchema.pre('save', function() {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  } else {
    this.subtotal = 0;
  }
});

module.exports = mongoose.model('Cart', cartSchema);

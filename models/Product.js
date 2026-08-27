const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  material: { type: String },
  size: { type: String },
  fabric: { type: String },
  type: { type: String }, // Maps to the user's "TYPE"
  pallu: { type: String },
  weight: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  originalPrice: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  discountedPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  sku: { type: String },
  status: { type: String, enum: ['Active', 'Draft', 'Out of Stock'], default: 'Active' },
  images: [{ type: String }], // up to 5 images
  colorVariants: [{
    colorName: String,
    imageUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

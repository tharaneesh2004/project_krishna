const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna_sarees';
    await mongoose.connect(uri, {
      // Removed the 2000ms timeout since Atlas connections can take slightly longer
    });
    console.log('Successfully connected to MongoDB! Connected to host:', mongoose.connection.host);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Starting In-Memory MongoDB for development fallback...');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');
  }
}
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const { router: adminAuth, authenticateAdmin } = require('./routes/adminAuth');
const adminProducts = require('./routes/adminProducts');
const adminCategories = require('./routes/adminCategories');
const adminOrders = require('./routes/adminOrders');
const adminDashboard = require('./routes/adminDashboard');
const adminCustomers = require('./routes/adminCustomers');
const publicApi = require('./routes/publicApi');

app.use('/api/admin', adminAuth); // Login & verify don't need auth middleware
app.use('/api/admin/products', authenticateAdmin, adminProducts);
app.use('/api/admin/categories', authenticateAdmin, adminCategories);
app.use('/api/admin/orders', authenticateAdmin, adminOrders);
app.use('/api/admin/dashboard', authenticateAdmin, adminDashboard);
app.use('/api/admin/customers', authenticateAdmin, adminCustomers);
app.use('/api', publicApi);

// Serve frontend React app assets
app.use('/assets', express.static(path.join(__dirname, 'frontend/dist/assets')));

// Serve the compiled React Admin Dashboard for any /admin... routes
app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Serve landing page and frontend app for all unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});

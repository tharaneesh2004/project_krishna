const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');
const Otp = require('../models/Otp');
const { notifyNewSignup, notifyContactMessage, sendOtpEmail, sendWelcomeEmail } = require('../utils/emailNotifier');

// ─── OTP FLOW ───────────────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB (upsert if exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Actually send the email
    try {
      await sendOtpEmail(email, otpCode);
      res.json({ message: 'OTP sent to your email successfully.' });
    } catch (emailErr) {
      console.error(emailErr);
      res.status(500).json({ message: 'Failed to send OTP email. Check SMTP configuration.' });
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = await Otp.findOne({ email });
    if (!record) return res.status(400).json({ message: 'OTP expired or not sent' });

    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Mark as verified by deleting the OTP or we just trust the client for this flow.
    await Otp.deleteOne({ email });

    res.json({ message: 'OTP verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public API to get active products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public API to get active categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── USER SIGNUP ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create user
    const user = new User({ name, email, mobile, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send email notification to admin (async, don't block response)
    notifyNewSignup({ name, email, mobile }).catch(err => console.error('Signup notification error:', err));
    
    // Send welcome email to customer (async, don't block response)
    sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err));

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── USER LOGIN ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CONTACT FORM ───────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const contactMsg = new ContactMessage({ name, email, subject, message });
    await contactMsg.save();

    // Send email notification (async, don't block response)
    notifyContactMessage({ name, email, subject, message }).catch(err => console.error('Contact notification error:', err));

    res.status(201).json({ message: 'Your message has been sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


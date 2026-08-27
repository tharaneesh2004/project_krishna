const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded admin credentials
const ADMIN_EMAIL = 'krishnaheritagecollection2026@gmail.com';
const ADMIN_EMAIL_TYPO = 'krishnaheritageccollection2026@gmail.com';
const ADMIN_PASSWORD = 'Krish@123';

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if ((email === ADMIN_EMAIL || email === ADMIN_EMAIL_TYPO) && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Verify token route
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

// Authentication middleware for other routes
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { router, authenticateAdmin };

const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const config = require('../config/env');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, city } = req.body;
    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      phone,
      city: city || 'Mumbai'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', [
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist')
      .populate('bookings');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, city },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset
router.post('/forgot-password', [
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: persist and email the OTP in a dedicated password reset flow.
    const response = {
      success: true,
      message: 'If the account exists, a reset code has been generated.'
    };

    if (!config.isProduction && user) {
      response.otp = otp;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

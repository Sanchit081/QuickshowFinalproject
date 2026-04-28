const express = require('express');
const { protect } = require('../middleware/auth');
const EmailService = require('../services/emailService');

const router = express.Router();

// @route   POST /api/email/booking-confirmation
// @desc    Send booking confirmation email
router.post('/booking-confirmation', async (req, res) => {
  try {
    const { bookingData } = req.body;
    
    if (!bookingData) {
      return res.status(400).json({ error: 'Booking data is required' });
    }

    const result = await EmailService.sendBookingConfirmation(bookingData);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Booking confirmation email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Booking confirmation email error:', error);
    res.status(500).json({ error: 'Failed to send booking confirmation email' });
  }
});

// @route   POST /api/email/welcome
// @desc    Send welcome email
router.post('/welcome', async (req, res) => {
  try {
    const { userData } = req.body;
    
    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const result = await EmailService.sendWelcomeEmail(userData);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Welcome email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

module.exports = router;

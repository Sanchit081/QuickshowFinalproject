const express = require('express');
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');

const router = express.Router();

// @route   POST /api/payments/create-order
// @desc    Create payment order (simplified - no external API needed)
router.post('/create-order', protect, async (req, res) => {
  try {
    console.log('💳 Payment request received:', req.body);
    const { bookingId } = req.body;

    if (!bookingId) {
      console.error('❌ Missing bookingId in request');
      return res.status(400).json({ 
        success: false,
        message: 'Booking ID is required' 
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error(`❌ Booking not found: ${bookingId}`);
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      console.error(`❌ Access denied for booking ${bookingId}`);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    // Mock payment - automatically approve for demo purposes
    // In production, this would integrate with Razorpay/Paytm/etc.
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentOrderId = `order_${booking.ticketNumber}_${Date.now()}`;

    // Update booking with payment IDs (keep status as pending, will be confirmed in confirm step)
    booking.paymentId = paymentId;
    booking.razorpayOrderId = paymentOrderId;
    // Keep paymentStatus as 'pending' - will be set to 'completed' in confirm step
    await booking.save();

    console.log(`✅ Payment processed for booking ${booking.ticketNumber}: ₹${booking.amountPaid}`);

    // Return success response
    const response = {
      success: true,
      paymentResult: {
        resultCode: 'Authorised',
        pspReference: paymentId,
        merchantReference: paymentOrderId,
        razorpayOrderId: paymentOrderId,
        paymentId: paymentId,
        paymentOrderId: paymentOrderId
      },
      bookingId: booking._id,
      message: 'Payment successful'
    };
    
    console.log('✅ Payment response:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Payment initiation failed:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message
    });
  }
});

module.exports = router;

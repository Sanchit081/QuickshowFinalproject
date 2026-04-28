const express = require('express');
const EventBooking = require('../models/EventBooking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Simple pricing rules for events (esp. concerts)
const getAreaPricing = (event) => {
  // Default tiers derived from event.price
  const min = event.price?.min || 1000;
  const max = event.price?.max || min * 2;
  const mid = Math.round((min + max) / 2);

  if (event.category === 'concert') {
    // For concerts, make VIP / VVIP clearly premium
    return {
      regular: min,
      vip: Math.round(mid * 1.5),
      vvip: Math.round(max * 2),
    };
  }

  // Other events: softer tiers
  return {
    regular: min,
    vip: mid,
    vvip: max,
  };
};

const getSecurityFee = (event, quantity) => {
  if (event.category !== 'concert') return 0;
  // Flat security add-on for concerts, lightly scaled with quantity
  const base = 1500;
  const perPerson = 300;
  return base + perPerson * Math.max(quantity - 1, 0);
};

// @route   POST /api/event-bookings
// @desc    Create booking for an event (no external payment for now)
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, area, quantity, personalSecurity } = req.body;

    if (!eventId || !area || !quantity) {
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const tiers = getAreaPricing(event);
    const areaKey = String(area).toLowerCase();
    if (!tiers[areaKey]) {
      return res.status(400).json({ message: 'Invalid area selected' });
    }

    const qty = Math.max(parseInt(quantity, 10) || 1, 1);

    const perTicket = tiers[areaKey];
    const baseAmount = perTicket * qty;
    const securityFee = personalSecurity ? getSecurityFee(event, qty) : 0;
    const convenienceFee = Math.round(baseAmount * 0.02); // 2%
    const gst = Math.round((baseAmount + securityFee + convenienceFee) * 0.18); // 18% GST
    const amountPaid = baseAmount + securityFee + convenienceFee + gst;

    const booking = await EventBooking.create({
      userId: req.user._id,
      eventId,
      area: areaKey,
      quantity: qty,
      isConcert: event.category === 'concert',
      personalSecurity: !!personalSecurity,
      baseAmount,
      securityFee,
      convenienceFee,
      gst,
      amountPaid,
      paymentStatus: 'completed', // for now, mark as completed
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Event booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/event-bookings
// @desc    Get current user's event bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await EventBooking.find({ userId: req.user._id })
      .populate('eventId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { protect } = require('../middleware/auth');
const QRCode = require('qrcode');
const {
  LOCK_DURATION_MS,
  holdSeats,
  releaseSeats,
  bookSeats,
  cleanupExpiredLocks,
  serializeShow,
  uniqueSeats
} = require('../utils/seatLocking');

const router = express.Router();

const inferSeatClass = (rowLabel = '') => {
  const row = rowLabel.toUpperCase();
  const platinumRows = ['A', 'B'];
  const goldRows = ['C', 'D', 'E'];
  if (platinumRows.includes(row)) return 'platinum';
  if (goldRows.includes(row)) return 'gold';
  return 'silver';
};

const calculateAmounts = (show, seats) => {
  const pricingMap = show.seatPricing || { platinum: 400, gold: 250, silver: 180 };
  const baseAmount = seats.reduce((total, seat) => {
    const seatClass = (seat.class || inferSeatClass(seat.row)).toLowerCase();
    return total + (pricingMap[seatClass] || 0);
  }, 0);

  const convenienceFee = Math.round(baseAmount * 0.02);
  const gst = Math.round(baseAmount * 0.18);

  return {
    baseAmount,
    convenienceFee,
    gst,
    amountPaid: baseAmount + convenienceFee + gst
  };
};

// @route   GET /api/bookings
// @desc    Get user bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('showId')
      .populate({
        path: 'showId',
        populate: { path: 'movieId' }
      })
      .populate({
        path: 'showId',
        populate: { path: 'cinemaId' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('showId')
      .populate({
        path: 'showId',
        populate: { path: 'movieId' }
      })
      .populate({
        path: 'showId',
        populate: { path: 'cinemaId' }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/bookings/hold
// @desc    Hold seats for checkout
router.post('/hold', protect, async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const normalizedSeats = uniqueSeats(seats);

    if (!showId || !normalizedSeats.length) {
      return res.status(400).json({ message: 'Show and seats are required' });
    }

    const updatedShow = await holdSeats({
      showId,
      userId: req.user._id,
      seats: normalizedSeats
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`show-${showId}`).emit('show-seats-updated', {
        showId,
        seats: normalizedSeats.map((seat) => ({
          row: seat.row,
          number: seat.number,
          status: 'locked'
        }))
      });
    }

    res.json({
      success: true,
      lockDurationMs: LOCK_DURATION_MS,
      holdExpiresAt: new Date(Date.now() + LOCK_DURATION_MS).toISOString(),
      show: serializeShow(updatedShow, req.user._id)
    });
  } catch (error) {
    const status = /not found/i.test(error.message) ? 404 : 409;
    res.status(status).json({ message: error.message });
  }
});

// @route   POST /api/bookings/release
// @desc    Release held seats
router.post('/release', protect, async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const normalizedSeats = uniqueSeats(seats);

    if (!showId || !normalizedSeats.length) {
      return res.status(400).json({ message: 'Show and seats are required' });
    }

    const updatedShow = await releaseSeats({
      showId,
      userId: req.user._id,
      seats: normalizedSeats
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`show-${showId}`).emit('show-seats-updated', {
        showId,
        seats: normalizedSeats.map((seat) => ({
          row: seat.row,
          number: seat.number,
          status: 'available'
        }))
      });
    }

    res.json({
      success: true,
      show: updatedShow ? serializeShow(updatedShow, req.user._id) : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create booking
router.post('/', protect, async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const normalizedSeats = uniqueSeats(seats);

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    await cleanupExpiredLocks(show);

    if (!normalizedSeats.length) {
      return res.status(400).json({ message: 'At least one seat is required' });
    }

    const unavailableSeat = normalizedSeats.find((seat) => {
      const matchingSeat = show.seats.find((showSeat) => (
        showSeat.row === seat.row &&
        showSeat.number === seat.number
      ));

      if (!matchingSeat) return true;
      if (matchingSeat.status === 'booked') return true;
      if (matchingSeat.status !== 'locked') return true;
      if (!matchingSeat.lockedBy || String(matchingSeat.lockedBy) !== String(req.user._id)) return true;
      if (!matchingSeat.lockedUntil || new Date(matchingSeat.lockedUntil).getTime() <= Date.now()) return true;

      return false;
    });

    if (unavailableSeat) {
      return res.status(409).json({
        message: `Seat ${unavailableSeat.row}${unavailableSeat.number} is not locked for this user`
      });
    }

    const { baseAmount, convenienceFee, gst, amountPaid } = calculateAmounts(show, normalizedSeats);

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      showId,
      seats: normalizedSeats,
      baseAmount,
      convenienceFee,
      gst,
      amountPaid,
      paymentStatus: 'pending'
    });

    // Generate QR code
    const qrData = JSON.stringify({
      bookingId: booking._id,
      ticketNumber: booking.ticketNumber,
      showId: showId,
      seats: normalizedSeats
    });

    const qrCode = await QRCode.toDataURL(qrData);
    booking.qrCode = qrCode;
    await booking.save();

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/bookings/:id/confirm
// @desc    Confirm booking after payment
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    console.log('✅ Confirming booking:', req.params.id);
    const { paymentId, razorpayOrderId, paymentOrderId } = req.body;
    
    const booking = await Booking.findById(req.params.id).populate('showId');

    if (!booking) {
      console.error('❌ Booking not found:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      console.error('❌ Access denied for booking:', req.params.id);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    // Update booking status
    booking.paymentStatus = 'completed';
    if (paymentId) {
      booking.paymentId = paymentId;
    }
    const resolvedOrderId = paymentOrderId || razorpayOrderId;
    if (resolvedOrderId) {
      booking.razorpayOrderId = resolvedOrderId;
    }

    const updatedShow = await bookSeats({
      showId: booking.showId._id,
      userId: req.user._id,
      seats: booking.seats
    });

    await booking.save();
    console.log(`✅ Booking ${booking.ticketNumber} confirmed`);

    // Update user bookings
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { bookings: booking._id }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`show-${booking.showId._id}`).emit('show-seats-updated', {
        showId: String(booking.showId._id),
        seats: booking.seats.map((seat) => ({
          row: seat.row,
          number: seat.number,
          status: 'booked'
        }))
      });
    }

    res.json({
      success: true,
      booking,
      show: serializeShow(updatedShow, req.user._id)
    });
  } catch (error) {
    console.error('❌ Error confirming booking:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;

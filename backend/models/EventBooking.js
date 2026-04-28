const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  area: {
    type: String,
    enum: ['regular', 'vip', 'vvip'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  isConcert: {
    type: Boolean,
    default: false,
  },
  personalSecurity: {
    type: Boolean,
    default: false,
  },
  baseAmount: {
    type: Number,
    required: true,
  },
  securityFee: {
    type: Number,
    default: 0,
  },
  convenienceFee: {
    type: Number,
    default: 0,
  },
  gst: {
    type: Number,
    default: 0,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed',
  },
  ticketNumber: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate ticket number before saving
eventBookingSchema.pre('save', function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `QSEVT${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('EventBooking', eventBookingSchema);

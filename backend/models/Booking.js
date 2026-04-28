const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  seats: [{
    row: String,
    number: Number,
    class: String
  }],
  amountPaid: {
    type: Number,
    required: true
  },
  baseAmount: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    default: 0
  },
  convenienceFee: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  razorpayOrderId: {
    type: String
  },
  qrCode: {
    type: String
  },
  ticketNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate ticket number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `QS${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);



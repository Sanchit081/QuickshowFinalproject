const mongoose = require('mongoose');

const seatStatusSchema = new mongoose.Schema({
  row: String,
  number: Number,
  class: {
    type: String,
    enum: ['platinum', 'gold', 'silver'],
    default: 'silver'
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'locked'],
    default: 'available'
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lockedUntil: Date
});

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  seatPricing: {
    platinum: {
      type: Number,
      default: 400
    },
    gold: {
      type: Number,
      default: 250
    },
    silver: {
      type: Number,
      default: 180
    }
  },
  seats: [seatStatusSchema],
  totalSeats: {
    type: Number,
    default: 0
  },
  availableSeats: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Show', showSchema);


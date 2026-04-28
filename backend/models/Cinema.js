const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  class: {
    type: String,
    enum: ['platinum', 'gold', 'silver'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  amenities: [{
    type: String
  }],
  seatLayout: {
    rows: Number,
    seatsPerRow: Number,
    seats: [seatSchema]
  },
  shows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cinema', cinemaSchema);



const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['concert', 'standup', 'workshop', 'theater', 'sports'],
    required: true
  },
  venue: {
    name: String,
    address: String,
    city: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  banner: {
    type: String
  },
  price: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  seatMap: {
    type: String // URL to seat map image
  },
  organizer: {
    name: String,
    contact: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);



const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genres: [String],
  languages: [String],

  cast: [{
    name: String,
    role: String,
    image: String
  }],
  crew: [{
    name: String,
    role: String,
    image: String
  }],

  duration: {
    type: Number,
    required: true
  },

  banner: String,
  poster: {
    type: String,
    required: true
  },
  trailerUrl: String,

  // 🎯 Release date (unchanged)
  releaseDate: {
    type: Date,
    required: true
  },

  // ✅ IMPORTANT FIX: booking dates
  availableDates: [{
    type: Date
  }],

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },

  reviews: [reviewSchema],

  isNowShowing: {
    type: Boolean,
    default: true
  },
  isComingSoon: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

movieSchema.index({ title: 'text', description: 'text', genres: 'text' });

module.exports = mongoose.model('Movie', movieSchema);

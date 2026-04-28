const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    sparse: true
  },
  phone: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  // AI-related preferences
  preferredGenres: [{
    type: String
  }],
  preferredLanguages: [{
    type: String
  }],
  viewingHistory: [{
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);



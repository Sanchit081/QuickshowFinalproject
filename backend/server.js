const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const User = require('./models/User');
const AIService = require('./services/aiService');
const config = require('./config/env');

const app = express();
const server = http.createServer(app);
const allowedOrigins = config.frontendOrigins;

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('io', io);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-show', ({ showId }) => {
    if (!showId) return;
    socket.join(`show-${showId}`);
  });

  socket.on('leave-show', ({ showId }) => {
    if (!showId) return;
    socket.leave(`show-${showId}`);
  });

  // Community chat events
  socket.on('join-community', ({ name }) => {
    const safeName = name || 'Guest';
    socket.join('community');
    io.to('community').emit('community-system', {
      name: 'QuickShow',
      text: `${safeName} joined the community chat`,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on('community-message', async (message) => {
    if (!message || typeof message.text !== 'string') return;

    let moderation = { flagged: false };
    let sentiment = { sentiment: 'neutral', score: 0 };

    try {
      moderation = await AIService.moderateContent(message.text);
      sentiment = AIService.analyzeSentiment(message.text);
    } catch (error) {
      console.error('Community moderation error:', error);
    }

    // Block inappropriate content
    if (moderation.flagged) {
      socket.emit('community-blocked', {
        reason: 'Content violates community guidelines',
        message: 'Your message was not sent due to inappropriate content.'
      });
      return;
    }
    
    const safeMessage = {
      name: message.name || 'User',
      text: message.text.slice(0, 500),
      createdAt: message.createdAt || new Date().toISOString(),
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score
    };
    
    // Send warning for negative sentiment
    if (sentiment.sentiment === 'negative' && sentiment.score < -0.3) {
      io.to('community').emit('community-warning', {
        name: 'QuickShow AI',
        text: 'Please keep the conversation positive and respectful.',
        createdAt: new Date().toISOString(),
      });
    }
    
    io.to('community').emit('community-message', safeMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/events', require('./routes/events'));
app.use('/api/cinemas', require('./routes/cinemas'));
app.use('/api/shows', require('./routes/shows'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/event-bookings', require('./routes/eventBookings'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/movie-summary', require('./routes/movie-summary'));
app.use('/api/email', require('./routes/email'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickShow API is running' });
});

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // Optional admin bootstrap for controlled environments only.
    if (config.enableDefaultAdminBootstrap) {
      try {
        if (!config.defaultAdminEmail || !config.defaultAdminPassword) {
          console.warn('⚠️ Default admin bootstrap skipped because credentials are missing');
        } else {
          let adminUser = await User.findOne({ email: config.defaultAdminEmail.toLowerCase() });

          if (!adminUser) {
            adminUser = new User({
              name: 'Admin',
              email: config.defaultAdminEmail.toLowerCase(),
              password: config.defaultAdminPassword,
              role: 'admin',
              city: 'Mumbai'
            });
            await adminUser.save();
            console.log('👑 Default admin user created:', config.defaultAdminEmail);
          } else if (adminUser.role !== 'admin') {
            adminUser.role = 'admin';
            await adminUser.save();
            console.log('👑 Existing user promoted to admin:', config.defaultAdminEmail);
          }
        }
      } catch (err) {
        console.error('❌ Error ensuring default admin user:', err);
      }
    }
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = config.port;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { io };

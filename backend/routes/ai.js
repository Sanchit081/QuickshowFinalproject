const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get personalized movie recommendations
router.get('/recommendations/:userId?', protect, async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's booking history
    const bookings = await Booking.find({ userId })
      .populate({
        path: 'showId',
        populate: { path: 'movieId' }
      })
      .sort({ createdAt: -1 })
      .limit(20);

    const watchedMovies = bookings
      .map((booking) => booking.showId?.movieId)
      .filter(Boolean);

    const watchedMovieIds = new Set(
      watchedMovies.map((movie) => String(movie._id))
    );

    // Extract user preferences
    const userPreferences = {
      genres: user.preferredGenres || [],
      languages: user.preferredLanguages || [],
      watchHistory: watchedMovies,
      ratings: user.viewingHistory?.map((item) => item.rating || 0).filter((rating) => rating > 0) || []
    };

    // Get all available movies
    const allMovies = await Movie.find({ isNowShowing: true });
    const unseenMovies = allMovies.filter((movie) => !watchedMovieIds.has(String(movie._id)));

    // Get AI recommendations
    const recommendations = await AIService.getMovieRecommendations(
      userPreferences, 
      unseenMovies.length ? unseenMovies : allMovies
    );

    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

// AI chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user context if available
    let context = {};
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        context = {
          userName: user.name,
          city: user.city,
          recentBookings: await Booking.find({ userId })
            .populate('movieId')
            .sort({ createdAt: -1 })
            .limit(3)
        };
      }
    }

    const response = await AIService.generateChatResponse(message, context);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat message' });
  }
});

// Sentiment analysis for community chat
router.post('/sentiment', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const analysis = AIService.analyzeSentiment(text);
    res.json(analysis);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ message: 'Error analyzing sentiment' });
  }
});

// Content moderation
router.post('/moderate', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const moderation = await AIService.moderateContent(text);
    res.json(moderation);
  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({ message: 'Error moderating content' });
  }
});

// Dynamic pricing
router.post('/dynamic-pricing', (req, res) => {
  try {
    const { basePrice, factors } = req.body;
    
    if (!basePrice) {
      return res.status(400).json({ message: 'Base price is required' });
    }

    const dynamicPrice = AIService.calculateDynamicPrice(basePrice, factors);
    res.json({ dynamicPrice });
  } catch (error) {
    console.error('Dynamic pricing error:', error);
    res.status(500).json({ message: 'Error calculating dynamic price' });
  }
});

// Enhanced search
router.post('/enhanced-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const enhancedQuery = await AIService.enhanceSearchQuery(query);
    
    // Perform enhanced search using the expanded query
    const searchResults = await Movie.find({
      $text: { $search: enhancedQuery.expandedQuery }
    }).limit(20);

    res.json({ 
      query: enhancedQuery,
      results: searchResults 
    });
  } catch (error) {
    console.error('Enhanced search error:', error);
    res.status(500).json({ message: 'Error performing enhanced search' });
  }
});

module.exports = router;

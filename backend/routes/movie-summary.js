const express = require('express');
const { protect } = require('../middleware/auth');
const Movie = require('../models/Movie');
const GeminiService = require('../services/geminiService');

const router = express.Router();

// @route   POST /api/movies/movie-summary
// @desc    Generate AI movie summary
router.post('/movie-summary', async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    // Fetch movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Generate AI summary
    const summary = await GeminiService.generateMovieSummary(movie);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Movie summary error:', error);
    res.status(500).json({ error: 'Failed to generate movie summary' });
  }
});

module.exports = router;

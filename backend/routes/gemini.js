const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const Movie = require('../models/Movie');

// Gemini AI Chat
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const wantsRecs = /(recommend|suggest|movies like|similar to|what should i watch|trending|top movies|ai picks|surprise me)/i.test(message);

    // Always provide the model a constrained, real catalog to pick from.
    const catalog = await Movie.find({ isNowShowing: true })
      .select('title poster banner rating genres description releaseDate duration')
      .sort({ rating: -1 })
      .limit(40)
      .lean();

    if (wantsRecs) {
      const recs = await GeminiService.generateMovieRecommendations(message, {
        ...context,
        availableMovies: catalog.map((m) => ({ title: m.title, genres: m.genres, rating: m.rating }))
      });

      const requestedTitles = (recs.recommendations || [])
        .map((r) => String(r.title || '').trim())
        .filter(Boolean);

      const movieRecommendations = requestedTitles
        .map((title) => {
          const found = catalog.find((m) => m.title.toLowerCase() === title.toLowerCase());
          return found ? { ...found, reason: (recs.recommendations || []).find((r) => r.title === title)?.reason } : null;
        })
        .filter(Boolean)
        .slice(0, 6);

      // If model didn't comply, fall back to top catalog
      const safeMovieRecommendations = movieRecommendations.length ? movieRecommendations : catalog.slice(0, 5);

      return res.json({
        response: recs.response || "Here are some picks from QuickShow you might love.",
        suggestions: recs.suggestions || ["More like this", "Different genre", "What's trending today?"],
        movieRecommendations: safeMovieRecommendations
      });
    }

    const response = await GeminiService.generateChatResponse(message, {
      ...context,
      availableMovies: catalog.map((m) => ({ title: m.title, genres: m.genres, rating: m.rating }))
    });

    // Keep compatibility with frontend
    res.json({
      response: response.response || response,
      suggestions: response.suggestions || [],
      movieRecommendations: response.movieRecommendations || []
    });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Movie Recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userInput, context = {} } = req.body;
    
    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    const recommendations = await GeminiService.generateMovieRecommendations(userInput, context);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Gemini Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Mood-based Recommendations
router.post('/mood-recommendations', async (req, res) => {
  try {
    const { mood } = req.body;
    
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const recommendations = await GeminiService.generateMoodBasedRecommendations(mood);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Gemini Mood Error:', error);
    res.status(500).json({ error: 'Failed to generate mood recommendations' });
  }
});

// Movie Summary Generation
router.post('/movie-summary', async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const summary = await GeminiService.generateMovieSummary(movie);
    
    res.json({ summary });
  } catch (error) {
    console.error('Gemini Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Surprise Me Feature
router.post('/surprise-me', async (req, res) => {
  try {
    const { preferences = {} } = req.body;
    
    // Get random movies
    const movies = await Movie.aggregate([
      { $match: { isNowShowing: true } },
      { $sample: { size: 10 } }
    ]);

    if (movies.length === 0) {
      return res.json({
        response: "I couldn't find any surprise movies right now. Try checking out our trending section!",
        movieRecommendations: [],
        suggestions: ["Check trending movies", "Browse all movies", "Try again later"]
      });
    }

    // Generate AI response for the surprise selection
    const surprisePrompt = "Surprise me with a great movie recommendation";
    const aiResponse = await GeminiService.generateChatResponse(surprisePrompt, {
      availableMovies: movies.map(m => ({ title: m.title, genres: m.genres }))
    });

    // Enhance response with actual movie data
    const enhancedResponse = {
      ...aiResponse,
      movieRecommendations: movies.slice(0, 3).map(movie => ({
        _id: movie._id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        genres: movie.genres,
        description: movie.description,
        reason: "A surprise pick just for you!"
      }))
    };
    
    res.json(enhancedResponse);
  } catch (error) {
    console.error('Surprise Me Error:', error);
    res.status(500).json({ error: 'Failed to generate surprise recommendation' });
  }
});

// AI Picks for Homepage
router.get('/ai-picks', async (req, res) => {
  try {
    // Cheap cache to avoid hammering Gemini and keep API stable.
    const cached = GeminiService.getCache?.('ai-picks');
    if (cached) {
      return res.json(cached);
    }

    // Get a diverse selection of movies
    const movies = await Movie.aggregate([
      { $match: { isNowShowing: true } },
      { $sample: { size: 20 } }
    ]);

    // Use AI to curate the best picks
    const aiResponse = await GeminiService.generateChatResponse(
      "Select the top 5 must-watch movies from this collection for today",
      { availableMovies: movies.map(m => ({ title: m.title, genres: m.genres, rating: m.rating })) }
    );

    // Get actual movie data for AI picks
    const aiPicks = movies.slice(0, 5).map(movie => ({
      _id: movie._id,
      title: movie.title,
      poster: movie.poster,
      rating: movie.rating,
      genres: movie.genres,
      description: movie.description,
      aiReason: "AI selected as a top pick"
    }));

    const payload = {
      picks: aiPicks,
      explanation: aiResponse.response
    };

    if (GeminiService.setCache) {
      GeminiService.setCache('ai-picks', payload, 10 * 60 * 1000);
    }

    res.json(payload);
  } catch (error) {
    console.error('AI Picks Error:', error);
    res.status(500).json({ error: 'Failed to generate AI picks' });
  }
});

module.exports = router;

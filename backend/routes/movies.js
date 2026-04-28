const express = require('express');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies (with date support)
router.get('/', async (req, res) => {
  try {
    const { genre, language, search, nowShowing, comingSoon, date } = req.query;
    let query = {};

    if (genre) query.genres = { $in: [genre] };
    if (language) query.languages = { $in: [language] };
    if (nowShowing === 'true') query.isNowShowing = true;
    if (comingSoon === 'true') query.isComingSoon = true;

    if (search) {
      query.$text = { $search: search };
    }

    // ✅ DATE FILTER FIX
    if (date) {
      const selectedDate = new Date(date);
      const start = new Date(selectedDate.setHours(0, 0, 0, 0));
      const end = new Date(selectedDate.setHours(23, 59, 59, 999));

      query.availableDates = {
        $gte: start,
        $lte: end
      };
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json({ success: true, count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const movies = await Movie.find({ isNowShowing: true })
      .sort({ rating: -1 })
      .limit(10);
    res.json({ success: true, count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/movies/top-rated
// @desc    Get top rated movies
router.get('/top-rated', async (req, res) => {
  try {
    const movies = await Movie.find({ isNowShowing: true })
      .sort({ rating: -1 })
      .limit(10);
    res.json({ success: true, count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/movies/hidden-gems
// @desc    Get hidden gems movies
router.get('/hidden-gems', async (req, res) => {
  try {
    const movies = await Movie.find({ isNowShowing: true })
      .sort({ rating: 1 })
      .limit(8);
    res.json({ success: true, count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Check if movie has shows, if not create them automatically
    const Show = require('../models/Show');
    const Cinema = require('../models/Cinema');
    const existingShows = await Show.countDocuments({ movieId: movie._id });
    
    console.log(`🔍 Checking shows for movie: ${movie.title} (ID: ${movie._id}), Existing shows: ${existingShows}`);
    
    if (existingShows === 0) {
      // Auto-create shows for movies without shows
      const cinemas = await Cinema.find({});
      console.log(`🎬 Found ${cinemas.length} cinemas`);
      
      if (cinemas.length > 0) {
        // Set movie as "Now Showing" if not set
        if (!movie.isNowShowing) {
          await Movie.findByIdAndUpdate(movie._id, { isNowShowing: true });
          movie.isNowShowing = true;
          console.log(`✅ Set movie "${movie.title}" as "Now Showing"`);
        }
        
        // Create shows for next 7 days
        const dates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          date.setHours(0, 0, 0, 0);
          dates.push(date);
        }
        const times = ['10:00', '13:30', '16:00', '19:00', '22:00'];
        let showsCreated = 0;
        
        for (const cinema of cinemas) {
          const seats = [];
          if (cinema.seatLayout?.seats?.length > 0) {
            cinema.seatLayout.seats.forEach((seat) => {
              seats.push({
                row: seat.row,
                number: seat.number,
                class: seat.class || 'silver',
                status: 'available',
              });
            });
          } else {
            // Default seats (10 rows x 20 seats)
            for (let i = 0; i < 10; i++) {
              for (let j = 1; j <= 20; j++) {
                let seatClass = 'silver';
                if (i < 2) seatClass = 'platinum';
                else if (i < 5) seatClass = 'gold';
                seats.push({
                  row: String.fromCharCode(65 + i),
                  number: j,
                  class: seatClass,
                  status: 'available',
                });
              }
            }
          }
          
          for (const date of dates) {
            for (const time of times) {
              try {
                const show = await Show.create({
                  movieId: movie._id,
                  cinemaId: cinema._id,
                  date: date,
                  time: time,
                  seatPricing: { platinum: 400, gold: 250, silver: 180 },
                  seats: seats.map(s => ({ ...s })),
                  totalSeats: seats.length,
                  availableSeats: seats.length,
                });
                
                // Update cinema's shows array
                await Cinema.findByIdAndUpdate(cinema._id, {
                  $addToSet: { shows: show._id }
                });
                
                showsCreated++;
              } catch (error) {
                console.error(`❌ Error creating show:`, error.message);
              }
            }
          }
        }
        console.log(`✅ Auto-created ${showsCreated} shows for movie: ${movie.title}`);
      } else {
        console.log(`⚠️ No cinemas found! Please create cinemas first.`);
      }
    } else {
      console.log(`✅ Movie "${movie.title}" already has ${existingShows} shows`);
    }
    
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/movies/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.reviews.push({
      userId: req.user._id,
      rating,
      comment
    });

    const totalRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0);
    movie.rating = (totalRating / movie.reviews.length).toFixed(1);

    await movie.save();
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

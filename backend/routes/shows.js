const express = require('express');
const Show = require('../models/Show');
const { cleanupExpiredLocks, serializeShow } = require('../utils/seatLocking');

const router = express.Router();

// @route   GET /api/shows
// @desc    Get shows with filters (FIXED DATE LOGIC)
router.get('/', async (req, res) => {
  try {
    const { movieId, cinemaId, city, date } = req.query;
    let query = {};

    if (movieId) query.movieId = movieId;
    if (cinemaId) query.cinemaId = cinemaId;

    // ✅ FIXED DATE HANDLING
    if (date) {
      const selected = new Date(date + 'T00:00:00');
      const start = new Date(selected);
      start.setHours(0, 0, 0, 0);

      const end = new Date(selected);
      end.setHours(23, 59, 59, 999);

      query.date = {
        $gte: start,
        $lte: end
      };
    }

    let shows = await Show.find(query)
      .populate('movieId')
      .populate('cinemaId')
      .sort({ date: 1, time: 1 });

    shows = await Promise.all(shows.map((show) => cleanupExpiredLocks(show)));

    // Filter by city if provided
    if (city) {
      shows = shows.filter(
        show => show.cinemaId && show.cinemaId.city === city
      );
    }

    res.json({
      success: true,
      count: shows.length,
      shows: shows.map((show) => serializeShow(show, req.user?._id))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/shows/:id
// @desc    Get show by ID
router.get('/:id', async (req, res) => {
  try {
    let show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('cinemaId');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    show = await cleanupExpiredLocks(show);

    res.json({
      success: true,
      show: serializeShow(show, req.user?._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filters
router.get('/', async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) query.category = category;
    if (city) query['venue.city'] = city;
    if (minPrice || maxPrice) {
      query['price.min'] = {};
      if (minPrice) query['price.min'].$gte = Number(minPrice);
      if (maxPrice) query['price.max'].$lte = Number(maxPrice);
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;



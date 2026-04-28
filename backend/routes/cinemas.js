const express = require('express');
const Cinema = require('../models/Cinema');

const router = express.Router();

// @route   GET /api/cinemas
// @desc    Get all cinemas by city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    
    if (city) {
      query.city = city;
    }

    const cinemas = await Cinema.find(query).populate('shows');
    res.json({ success: true, count: cinemas.length, cinemas });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/cinemas/:id
// @desc    Get cinema by ID
router.get('/:id', async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id)
      .populate('shows');
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    res.json({ success: true, cinema });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;



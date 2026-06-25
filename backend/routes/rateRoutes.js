const express = require('express');
const router = express.Router();
const Rate = require('../models/Rate');

// Get current rate
router.get('/', async (req, res) => {
  try {
    let rate = await Rate.findOne().sort({ updatedAt: -1 });
    if (!rate) {
      rate = await Rate.create({ value: 1850 });
    }
    res.json(rate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update rate (Admin only)
router.put('/', async (req, res) => {
  try {
    const { value } = req.body;
    const rate = await Rate.findOneAndUpdate(
      {}, 
      { value, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(rate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

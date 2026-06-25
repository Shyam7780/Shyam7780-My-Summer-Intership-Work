const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Create new inquiry from frontend
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all inquiries (for admin)
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

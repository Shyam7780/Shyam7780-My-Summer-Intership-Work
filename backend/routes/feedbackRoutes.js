const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit feedback from frontend
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get approved feedbacks for frontend
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all feedbacks (admin)
router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve feedback
router.put('/:id/approve', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery.length > 0 ? gallery : [
      { _id: '1', url: '/images/house1.jpg', caption: '2-Story Modern Villa - Patna', category: 'completed' },
      { _id: '2', url: '/images/project1.jpg', caption: 'Ongoing Construction Project', category: 'ongoing' }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new gallery item
router.post('/', async (req, res) => {
  try {
    const galleryItem = new Gallery(req.body);
    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

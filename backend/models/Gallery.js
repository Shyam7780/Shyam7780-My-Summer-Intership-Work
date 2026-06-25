const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, required: true },
  category: { type: String, enum: ['completed', 'ongoing', 'interior'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);

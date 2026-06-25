import connectToDatabase from './db.js';
import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, required: true },
  category: { type: String, enum: ['completed', 'ongoing', 'interior'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

export default async function handler(req, res) {
  await connectToDatabase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const items = await Gallery.find().sort({ createdAt: -1 });
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const item = new Gallery(req.body);
      await item.save();
      return res.status(201).json(item);
    }

    if (req.method === 'DELETE' && req.query.id) {
      await Gallery.findByIdAndDelete(req.query.id);
      return res.status(200).json({ success: true, message: 'Deleted successfully' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Gallery API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
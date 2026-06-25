import connectToDatabase from './db.js';
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const feedback = new Feedback(req.body);
      await feedback.save();
      return res.status(201).json({ success: true, data: feedback });
    }

    if (req.method === 'GET') {
      const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
      return res.status(200).json(feedbacks);
    }

    if (req.method === 'PUT' && req.query.id) {
      const feedback = await Feedback.findByIdAndUpdate(
        req.query.id,
        { approved: true },
        { new: true }
      );
      return res.status(200).json(feedback);
    }

    if (req.method === 'DELETE' && req.query.id) {
      await Feedback.findByIdAndDelete(req.query.id);
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Feedback API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
import connectToDatabase from './db.js';
import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema({
  value: { type: Number, required: true, default: 1850 },
  updatedAt: { type: Date, default: Date.now }
});

const Rate = mongoose.models.Rate || mongoose.model('Rate', RateSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      let rate = await Rate.findOne().sort({ updatedAt: -1 });
      if (!rate) {
        rate = await Rate.create({ value: 1850 });
      }
      return res.status(200).json({ value: rate.value, updatedAt: rate.updatedAt });
    }

    if (req.method === 'PUT') {
      const { value } = req.body;
      if (!value || value < 1000 || value > 5000) {
        return res.status(400).json({ error: 'Invalid rate value' });
      }
      const rate = await Rate.findOneAndUpdate(
        {},
        { value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return res.status(200).json({ value: rate.value });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Rate API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
import connectToDatabase from './db.js';
import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default async function handler(req, res) {
  await connectToDatabase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const inquiry = new Inquiry(req.body);
      await inquiry.save();
      return res.status(201).json({ success: true, data: inquiry });
    }

    if (req.method === 'GET') {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.status(200).json(inquiries);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
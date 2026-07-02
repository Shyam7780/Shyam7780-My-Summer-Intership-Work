import connectDB from '../db-client.js';
import Feedback from '../models/Feedback.js'; // आपका नया मॉडल

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    await connectDB(); // डेटाबेस से कनेक्ट करें

    // 1. GET: एडमिन के लिए सारे फीडबैक और नॉर्मल यूजर के लिए सिर्फ APPROVED फीडबैक
    if (req.method === 'GET') {
      const { isAdmin } = req.query; // अगर फ्रंटएंड से ?isAdmin=true भेजेंगे
      
      let query = { approved: true };
      if (isAdmin === 'true') {
        query = {}; // एडमिन को approved और pending दोनों दिखाई देंगे
      }

      const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
      return res.status(200).json(feedbacks);
    }

    // 2. POST: नया फीडबैक सबमिट करना (जीमेल डेटा और बेस64 इमेज के साथ)
    if (req.method === 'POST') {
      // फ्रंटएंड से name, rating, comment, userEmail, userProfilePic, reviewImage भेजेंगे
      const newFeedback = await Feedback.create({ ...req.body, approved: false });
      return res.status(201).json(newFeedback);
    }

    // 3. PUT: एडमिन पैनल से फीडबैक को अप्रूव (True) या रिजेक्ट करने के लिए
    if (req.method === 'PUT') {
      const { id, approved } = req.body; // फीडबैक की ID और true/false स्टेटस
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        id, 
        { approved }, 
        { new: true }
      );
      return res.status(200).json(updatedFeedback);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userEmail: { type: String },          // गूगल से वेरीफाइड जीमेल स्टोर करने के लिए
  userProfilePic: { type: String },     // गूगल प्रोफाइल फोटो स्टोर करने के लिए
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  reviewImage: { type: String },        // बेस64 फॉर्मेट में अटैच की गई फोटो के लिए
  approved: { type: Boolean, default: false }, // डिफ़ॉल्ट रूप से फॉल्स रहेगा
  createdAt: { type: Date, default: Date.now }
});

// अगर मॉडल पहले से बना है तो उसे यूज़ करें, नहीं तो नया बनाएं (Vercel Serverless के लिए बेस्ट)
module.exports = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
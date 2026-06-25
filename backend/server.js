const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import Routes
const rateRoutes = require('./routes/rateRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use Routes
app.use('/api/rate', rateRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Chhotan Ram Construction Backend is Running with MongoDB ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📧 Contact: ramchhotan63@gmail.com');
  console.log('📍 Tej Pratap Nagar, Beur, Patna-2');
});

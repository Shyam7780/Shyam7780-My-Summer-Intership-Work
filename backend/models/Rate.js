const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    default: 1850
  },
  updatedBy: {
    type: String,
    default: 'admin'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rate', RateSchema);

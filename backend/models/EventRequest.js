const mongoose = require('mongoose');

const EventRequestSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  hospitalAddress: { type: String, required: true },
  preferredDate: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  additionalDetails: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventRequest', EventRequestSchema);

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blood_type: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  donation_date: {
    type: Date,
    required: true,
  },
  hospital: {
    type: String,
    default: ""
  },
  frequency: {
    type: Number,
    default: 1,  // Starting frequency (you can update it later)
  },
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;

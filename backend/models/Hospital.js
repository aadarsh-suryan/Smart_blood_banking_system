const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  beds: { type: Number, default: 0 },
  rooms: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', hospitalSchema);



const mongoose = require('mongoose');

// Real-time blood donation record
const BloodDonationRecord = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  hospitalName: {
    type: String,
    required: true
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  unitsCollected: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  donationType: {
    type: String,
    enum: ['whole_blood', 'platelets', 'plasma', 'red_cells'],
    default: 'whole_blood'
  },
  donorAge: {
    type: Number,
    required: true
  },
  donorGender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  weather: {
    type: String,
    enum: ['sunny', 'rainy', 'cloudy', 'stormy', 'cold'],
    default: 'sunny'
  },
  eventType: {
    type: String,
    enum: ['regular', 'camp', 'emergency', 'festival'],
    default: 'regular'
  }
}, {
  timestamps: true
});

// Real-time blood request record
const BloodRequestRecord = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requesterName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  hospitalName: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  patientGender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  medicalCondition: {
    type: String,
    required: true
  },
  isFulfilled: {
    type: Boolean,
    default: false
  },
  fulfilledDate: {
    type: Date
  },
  fulfilledUnits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Blood inventory tracking
const BloodInventory = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']
  },
  currentStock: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  minimumThreshold: {
    type: Number,
    default: 10
  },
  maximumCapacity: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

module.exports = {
  BloodDonationRecord: mongoose.model('BloodDonationRecord', BloodDonationRecord),
  BloodRequestRecord: mongoose.model('BloodRequestRecord', BloodRequestRecord),
  BloodInventory: mongoose.model('BloodInventory', BloodInventory)
};

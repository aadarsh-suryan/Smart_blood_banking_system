const express = require('express');
const Hospital = require('../models/Hospital');
const router = express.Router();

// Create or update hospital registration
router.post('/register', async (req, res) => {
  try {
    const data = req.body;
    const existing = await Hospital.findOne({ hospitalId: data.hospitalId });
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
      return res.json({ message: 'Hospital updated', hospital: existing });
    }
    const hospital = await Hospital.create(data);
    res.status(201).json({ message: 'Hospital registered', hospital });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register hospital', error: err.message });
  }
});

// Get hospital by id
router.get('/:hospitalId', async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ hospitalId: req.params.hospitalId });
    if (!hospital) return res.status(404).json({ message: 'Not found' });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hospital', error: err.message });
  }
});

module.exports = router;



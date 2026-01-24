const express = require('express');
const router = express.Router();
const EventRequest = require('../models/EventRequest');

// GET all event requests
router.get('/', async (req, res) => {
  try {
    const requests = await EventRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event requests.' });
  }
});

// POST a new event request
router.post('/', async (req, res) => {
  try {
    const newRequest = new EventRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Event request submitted!' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit event request.' });
  }
});

module.exports = router;

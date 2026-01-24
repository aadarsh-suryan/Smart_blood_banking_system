// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const authRoutes = require('./routes/auth');
const hospitalRoutes = require('./routes/hospital');
const contactRoutes = require('./routes/contact');
const eventRequestRoutes = require('./routes/eventRequest');
const analyticsRoutes = require('./routes/analytics');
const realtimeRoutes = require('./routes/realtime');

const app = express();
app.use(cors());
app.use(express.json());

// Routes

// Health check route
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

app.use('/api', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/contact', contactRoutes);  // POST goes to /api/contact
app.use('/api/auth/requests', eventRequestRoutes); // For event requests from EventsPage
app.use('/api/analytics', analyticsRoutes); // Blood analytics and ML predictions
app.use('/api/realtime', realtimeRoutes); // Real-time blood donation/request tracking

app.post('/predict', async (req, res) => {
  try {
    // Forward the request to the Python backend
    const response = await axios.post('http://localhost:4000/predict', req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Prediction service unavailable.' });
  }
});

mongoose.connect('mongodb://127.0.0.1:27017/donation_app', {
}).then(() => {
  console.log('MongoDB connected');
  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
  });
}).catch((err) => {
  console.error('MongoDB connection failed:', err);
});

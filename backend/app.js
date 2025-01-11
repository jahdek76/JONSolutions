const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const callsRouter = require('./routes/calls');
const leadsRouter = require('./routes/leads');
const trainingRouter = require('./routes/training');
const statsRouter = require('./routes/stats');
const path = require('path');

const app = express();

// Connect to MongoDB (with retry logic for serverless)
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoDbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API routes
app.use('/api/calls', callsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/training', trainingRouter);
app.use('/api/stats', statsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export for serverless
module.exports = app; 
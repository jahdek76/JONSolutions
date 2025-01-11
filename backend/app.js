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

// Connect to MongoDB
mongoose.connect(config.mongoDbUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-project-name.vercel.app' 
    : 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API routes
app.use('/api/calls', callsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/training', trainingRouter);
app.use('/api/stats', statsRouter);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Error handling middleware should be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
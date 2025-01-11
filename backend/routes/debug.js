const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      mongoConnection: mongoose.connection.readyState,
      apiEndpoint: req.originalUrl,
      headers: req.headers,
    };
    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
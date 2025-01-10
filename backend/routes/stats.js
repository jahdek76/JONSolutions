const express = require('express');
const router = express.Router();
const Lead = require('../models/lead');
const Call = require('../models/call');

router.get('/', async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const activeCalls = await Call.countDocuments({ status: 'in-progress' });
        const completedCalls = await Call.countDocuments({ status: 'completed' });

        res.json({
            totalLeads,
            activeCalls,
            completedCalls
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
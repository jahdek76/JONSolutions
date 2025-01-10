const express = require('express');
const router = express.Router();
const Lead = require('../models/lead');

// Get all leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new lead
router.post('/', async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update lead
router.put('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(lead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete lead
router.delete('/:id', async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
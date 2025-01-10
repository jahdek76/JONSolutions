const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    status: {
        type: String,
        enum: ['new', 'contacted', 'follow-up', 'converted', 'closed'],
        default: 'new'
    },
    lastContact: Date,
    nextFollowUp: Date,
    notes: [{ 
        content: String, 
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Lead', leadSchema); 
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    timestamp: { type: Date, default: Date.now },
    duration: Number,
    recording: String,
    transcript: String,
    summary: String,
    sentiment: String,
    nextActions: [String],
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'failed'],
        default: 'scheduled'
    }
});

module.exports = mongoose.model('Call', callSchema); 
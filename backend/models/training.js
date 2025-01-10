const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'url', 'file'],
        required: true
    },
    content: String,
    url: String,
    fileName: String,
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    processedData: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Training', trainingSchema); 
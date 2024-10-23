const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: String, required: true },
    completionDate: { type: Date, required: true }
});

module.exports = mongoose.model('Project', projectSchema);

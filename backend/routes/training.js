const express = require('express');
const router = express.Router();
const Training = require('../models/training');
const { OpenAI } = require('openai');
const config = require('../config/config');
const multer = require('multer');
const axios = require('axios');
const cheerio = require('cheerio');

const openai = new OpenAI(config.openaiApiKey);
const upload = multer({ dest: 'uploads/' });

// Add training data from text
router.post('/text', async (req, res) => {
    try {
        const { content } = req.body;
        const training = new Training({
            type: 'text',
            content,
            status: 'processing'
        });

        // Process the text with OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Process this training data and extract key information for customer service." },
                { role: "user", content }
            ]
        });

        training.processedData = completion.choices[0].message.content;
        training.status = 'completed';
        await training.save();

        res.status(201).json(training);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add training data from URL
router.post('/url', async (req, res) => {
    try {
        const { url } = req.body;
        const training = new Training({
            type: 'url',
            url,
            status: 'processing'
        });

        // Fetch and parse webpage content
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const content = $('body').text();

        // Process the content with OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Process this webpage content and extract key information for customer service." },
                { role: "user", content }
            ]
        });

        training.processedData = completion.choices[0].message.content;
        training.status = 'completed';
        await training.save();

        res.status(201).json(training);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add training data from file
router.post('/file', upload.single('file'), async (req, res) => {
    try {
        const training = new Training({
            type: 'file',
            fileName: req.file.originalname,
            status: 'processing'
        });

        // Process the file content (assuming it's text)
        const content = require('fs').readFileSync(req.file.path, 'utf8');

        // Process the content with OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Process this file content and extract key information for customer service." },
                { role: "user", content }
            ]
        });

        training.processedData = completion.choices[0].message.content;
        training.status = 'completed';
        await training.save();

        res.status(201).json(training);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
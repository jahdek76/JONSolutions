const express = require('express');
const router = express.Router();
const Call = require('../models/call');
const { OpenAI } = require('openai');
const { ElevenLabs } = require('elevenlabs-node');
const config = require('../config/config');

const openai = new OpenAI(config.openaiApiKey);
const elevenlabs = new ElevenLabs(config.elevenLabsApiKey);

// Schedule a new call
router.post('/schedule', async (req, res) => {
    try {
        const { leadId, scheduledTime } = req.body;
        const call = new Call({
            leadId,
            timestamp: scheduledTime,
            status: 'scheduled'
        });
        await call.save();
        res.status(201).json(call);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initiate a call
router.post('/initiate/:id', async (req, res) => {
    try {
        const call = await Call.findById(req.params.id);
        if (!call) {
            return res.status(404).json({ error: 'Call not found' });
        }

        // Generate AI response
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a professional customer service representative for a rice milling company." },
                { role: "user", content: "Generate a natural conversation opener for a follow-up call." }
            ]
        });

        // Convert text to speech
        const voice = await elevenlabs.generate({
            text: completion.choices[0].message.content,
            voice_id: req.body.voiceId
        });

        // Update call status
        call.status = 'in-progress';
        await call.save();

        res.json({ 
            audioStream: voice,
            text: completion.choices[0].message.content
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End a call
router.post('/end/:id', async (req, res) => {
    try {
        const { transcript, duration } = req.body;
        const call = await Call.findById(req.params.id);
        
        // Generate call summary using AI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Analyze this call transcript and provide a summary, sentiment, and next actions." },
                { role: "user", content: transcript }
            ]
        });

        const analysis = JSON.parse(completion.choices[0].message.content);

        call.status = 'completed';
        call.duration = duration;
        call.transcript = transcript;
        call.summary = analysis.summary;
        call.sentiment = analysis.sentiment;
        call.nextActions = analysis.nextActions;

        await call.save();
        res.json(call);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
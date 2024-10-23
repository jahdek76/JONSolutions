const express = require('express');
const router = express.Router();
const Project = require('../models/project');

router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    const projects = await Project.find();
    res.render('projects', { projects });
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const project = new Project(req.body);
    await project.save();
    res.redirect('/projects');
});

module.exports = router;

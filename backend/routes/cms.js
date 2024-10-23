const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Message = require('../models/message');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        console.log('User not authenticated, redirecting to login');
        res.redirect('/auth/login');
    }
};

// CMS Dashboard
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const projectCount = await Project.countDocuments();
        const messageCount = await Message.countDocuments();
        res.render('cms/dashboard', { projectCount, messageCount });
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred while loading the CMS dashboard' });
    }
});

// Projects CRUD with pagination, search, and filtering
router.get('/projects', isAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const filter = req.query.filter || '';

        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { client: { $regex: search, $options: 'i' } }
            ];
        }
        if (filter) {
            query.client = filter;
        }

        const totalProjects = await Project.countDocuments(query);
        const totalPages = Math.ceil(totalProjects / limit);

        const projects = await Project.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const clients = await Project.distinct('client');

        res.render('cms/projects', { 
            projects, 
            currentPage: page, 
            totalPages, 
            search, 
            filter,
            clients
        });
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred while loading projects' });
    }
});

router.get('/projects/new', isAuthenticated, (req, res) => {
    res.render('cms/project-form', { project: {} });
});

router.post('/projects', isAuthenticated, async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.redirect('/cms/projects');
    } catch (error) {
        res.status(400).render('cms/project-form', { project: req.body, error: error.message });
    }
});

router.get('/projects/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.render('cms/project-form', { project });
    } catch (error) {
        res.status(404).render('error', { error: 'Project not found' });
    }
});

router.post('/projects/:id', isAuthenticated, async (req, res) => {
    try {
        await Project.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/cms/projects');
    } catch (error) {
        res.status(400).render('cms/project-form', { project: req.body, error: error.message });
    }
});

router.post('/projects/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.redirect('/cms/projects');
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred while deleting the project' });
    }
});

// Messages management with pagination, search, and filtering
router.get('/messages', isAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const filter = req.query.filter || '';

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        if (filter) {
            query.read = filter === 'read';
        }

        const totalMessages = await Message.countDocuments(query);
        const totalPages = Math.ceil(totalMessages / limit);

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.render('cms/messages', { 
            messages, 
            currentPage: page, 
            totalPages, 
            search, 
            filter 
        });
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred while loading messages' });
    }
});

router.post('/messages/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.redirect('/cms/messages');
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred while deleting the message' });
    }
});

module.exports = router;

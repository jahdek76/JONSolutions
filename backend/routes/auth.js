const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    // Implement login logic
});

router.post('/register', async (req, res) => {
    // Implement registration logic
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

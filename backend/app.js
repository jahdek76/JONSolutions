const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const Project = require('./models/project');
const Message = require('./models/message');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cmsRoutes = require('./routes/cms');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/messages', messageRoutes);
app.use('/cms', cmsRoutes);

// Dashboard route
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    try {
        const projectCount = await Project.countDocuments();
        const newMessageCount = await Message.countDocuments({ read: false });
        res.render('dashboard', { projectCount, newMessageCount });
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred while loading the dashboard' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Catch-all route to serve the frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Export the Express app
module.exports = app;

// Only listen on a port if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

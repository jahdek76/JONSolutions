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
const MongoStore = require('connect-mongo');

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

// Session configuration for Vercel's serverless environment
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60, // = 14 days. Default
        autoRemove: 'native' // Default
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days
    }
}));

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

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the Express app
module.exports = app;

// Only listen on a port if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

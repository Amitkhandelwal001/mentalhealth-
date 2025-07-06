const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'MindCare API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>')) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('⚠️  MongoDB connection skipped - update .env with real MongoDB URI');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without database connection for development');
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const activityRoutes = require('./routes/activities');
const communityRoutes = require('./routes/community');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to MindCare API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      mood: '/api/mood',
      activities: '/api/activities',
      community: '/api/community'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 3001;

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Home: http://localhost:${PORT}/`);
  });
};

startServer(); 
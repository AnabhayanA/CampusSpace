const mongoose = require('mongoose');
const logger = require('../utils/logger');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusspace';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info('[Database] - MongoDB connected successfully', {
      host: conn.connection.host,
      database: conn.connection.name,
      port: conn.connection.port
    });
    
    return conn;
  } catch (error) {
    logger.error('[Database] - MongoDB connection failed', {
      error: error.message,
      stack: error.stack
    });
    
    // Fallback message for development
    logger.warn('[Database] - Running in development mode without database', {
      message: 'Install MongoDB locally or set MONGODB_URI environment variable'
    });
    
    return null;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('[Database] - Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('[Database] - Mongoose connection error', {
    error: err.message
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('[Database] - Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('[Database] - MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;

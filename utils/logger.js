const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Color codes for console output
const COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m'
};

// Log file streams
const logStreams = {
  access: fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' }),
  error: fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' }),
  app: fs.createWriteStream(path.join(logsDir, 'app.log'), { flags: 'a' }),
  dataRefresh: fs.createWriteStream(path.join(logsDir, 'data-refresh.log'), { flags: 'a' }),
  roomAvailability: fs.createWriteStream(path.join(logsDir, 'room-availability.log'), { flags: 'a' })
};

// Format timestamp
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 23);
}

// Format log message
function formatLogMessage(level, source, message, data = null) {
  const timestamp = getTimestamp();
  let logMsg = `[${timestamp}] [${level}] [${source}] - ${message}`;
  
  if (data) {
    logMsg += ` | ${JSON.stringify(data)}`;
  }
  
  return logMsg;
}

// Write to log file
function writeToFile(stream, message) {
  stream.write(message + '\n');
}

// Write to console with color
function writeToConsole(level, message) {
  const color = COLORS[level] || COLORS.RESET;
  console.log(`${color}${message}${COLORS.RESET}`);
}

// Main logging function
function log(level, source, message, data = null, logFile = 'app') {
  const formattedMessage = formatLogMessage(level, source, message, data);
  
  // Write to console
  writeToConsole(level, formattedMessage);
  
  // Write to appropriate log file
  if (logStreams[logFile]) {
    writeToFile(logStreams[logFile], formattedMessage);
  }
  
  // Always write errors to error.log
  if (level === LOG_LEVELS.ERROR && logFile !== 'error') {
    writeToFile(logStreams.error, formattedMessage);
  }
  
  // Write everything to app.log
  if (logFile !== 'app') {
    writeToFile(logStreams.app, formattedMessage);
  }
}

// Convenience methods
const logger = {
  // General logging
  info: (source, message, data = null) => {
    log(LOG_LEVELS.INFO, source, message, data, 'app');
  },
  
  error: (source, message, data = null) => {
    log(LOG_LEVELS.ERROR, source, message, data, 'error');
  },
  
  warn: (source, message, data = null) => {
    log(LOG_LEVELS.WARN, source, message, data, 'app');
  },
  
  debug: (source, message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      log(LOG_LEVELS.DEBUG, source, message, data, 'app');
    }
  },
  
  // Specific logging categories
  access: (method, path, statusCode, responseTime, ip = 'unknown') => {
    const message = `${method} ${path} - ${statusCode} - ${responseTime}ms`;
    log(LOG_LEVELS.INFO, 'API', message, { ip }, 'access');
  },
  
  dataRefresh: (message, data = null) => {
    log(LOG_LEVELS.INFO, 'DataRefresh', message, data, 'dataRefresh');
  },
  
  roomAvailability: (message, data = null) => {
    log(LOG_LEVELS.INFO, 'RoomAvailability', message, data, 'roomAvailability');
  },
  
  // Request logging middleware
  requestLogger: (req, res, next) => {
    const startTime = Date.now();
    
    // Log when response finishes
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const ip = req.ip || req.connection.remoteAddress;
      logger.access(req.method, req.path, res.statusCode, responseTime, ip);
    });
    
    next();
  },
  
  // Error logging middleware
  errorLogger: (err, req, res, next) => {
    logger.error('Express', err.message, {
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query
    });
    next(err);
  },
  
  // Log server startup
  startup: (port, environment = 'development') => {
    logger.info('Server', `CampusSpace server started on port ${port}`, {
      environment,
      nodeVersion: process.version,
      platform: process.platform
    });
  },
  
  // Log server shutdown
  shutdown: (reason = 'Unknown') => {
    logger.info('Server', 'CampusSpace server shutting down', { reason });
  },
  
  // Close all log streams
  close: () => {
    Object.values(logStreams).forEach(stream => stream.end());
  }
};

// Handle process termination
process.on('SIGINT', () => {
  logger.shutdown('SIGINT received');
  logger.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.shutdown('SIGTERM received');
  logger.close();
  process.exit(0);
});

module.exports = logger;

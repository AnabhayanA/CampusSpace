# CampusSpace Logging Architecture

## 📋 Log Structure

### Log Files
```
/logs/
├── access.log          # HTTP requests & API calls
├── error.log           # Errors & exceptions
├── app.log             # General application logs
├── data-refresh.log    # Course data fetching logs
├── room-availability.log # Room status calculations
└── debug.log           # Debug information (dev only)
```

### Log Levels
- **ERROR**: Critical errors that need immediate attention
- **WARN**: Warning messages for potential issues
- **INFO**: General informational messages
- **DEBUG**: Detailed debug information

### Log Format
```
[TIMESTAMP] [LEVEL] [SOURCE] - MESSAGE
```

**Example:**
```
[2025-12-21 14:30:45.123] [INFO] [API] - GET /api/rooms/availability - 200 - 45ms
[2025-12-21 14:30:46.456] [ERROR] [DataFetch] - Failed to fetch NJIT data: Timeout
```

## 📊 Log Categories

### 1. Access Logs (access.log)
Tracks all HTTP requests:
- Request method & path
- Response status code
- Response time
- IP address
- User agent

### 2. Error Logs (error.log)
Captures all errors:
- Stack traces
- Error messages
- Context information
- Timestamp

### 3. Application Logs (app.log)
General application events:
- Server start/stop
- Configuration changes
- Important state changes

### 4. Data Refresh Logs (data-refresh.log)
Course data fetching:
- Fetch attempts
- Success/failure status
- Number of courses fetched
- Data source (NJIT vs sample)

### 5. Room Availability Logs (room-availability.log)
Room status calculations:
- Availability calculations
- Room status changes
- Schedule parsing

## 🔄 Log Rotation

### Daily Rotation
- Logs rotate daily at midnight
- Kept for 30 days
- Compressed after 7 days
- Format: `access.log.2025-12-21.gz`

### Size-Based Rotation
- Max file size: 10MB
- Max files: 10
- Older files automatically deleted

## 📈 Log Analysis

### Common Queries

**1. Find all errors today:**
```bash
grep "ERROR" logs/error.log | grep "2025-12-21"
```

**2. Count API requests:**
```bash
grep "GET /api" logs/access.log | wc -l
```

**3. Find slow requests (>1000ms):**
```bash
grep -E "\d{4,}ms" logs/access.log
```

**4. Monitor real-time logs:**
```bash
tail -f logs/app.log
```

### Log Monitoring Dashboard
Access at: `http://localhost:3000/logs/viewer.html`

## 🛠️ Configuration

### Environment Variables
```bash
LOG_LEVEL=info          # Set log level
LOG_TO_FILE=true        # Enable file logging
LOG_TO_CONSOLE=true     # Enable console logging
LOG_MAX_FILES=30        # Keep 30 days
LOG_MAX_SIZE=10485760   # 10MB max size
```

### Development vs Production

**Development:**
- Console logging enabled
- DEBUG level
- No compression
- Short retention

**Production:**
- File logging only
- INFO level
- Compression enabled
- 30-day retention

## 🔐 Security Considerations

- Never log sensitive data (passwords, tokens)
- Sanitize user input in logs
- Restrict log file permissions
- Regular log cleanup
- Monitor for suspicious patterns

## 📱 Integration

### Node.js
```javascript
const logger = require('./utils/logger');

logger.info('Server started', { port: 3000 });
logger.error('Database connection failed', { error: err });
```

### Express Middleware
```javascript
app.use(requestLogger);  // Logs all requests
app.use(errorLogger);    // Logs all errors
```

## 🎯 Best Practices

1. **Structured Logging**: Use JSON format for easy parsing
2. **Context**: Include relevant context (user, request ID)
3. **Correlation**: Track requests across services
4. **Sampling**: Sample high-volume logs
5. **Alerts**: Set up alerts for critical errors

## 📊 Metrics to Track

- Total requests per hour
- Error rate percentage
- Average response time
- Data fetch success rate
- Room availability calculation time
- Active users count
- Most accessed rooms
- Peak usage times

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const sampleData = require('./sample-data');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Check if we should use authenticated scraping
const USE_NJIT_AUTH = process.env.NJIT_USERNAME && process.env.NJIT_PASSWORD;
if (USE_NJIT_AUTH) {
  logger.info('[Server] - NJIT credentials detected, will use authenticated scraping');
} else {
  logger.warn('[Server] - No NJIT credentials found, using sample data. Add NJIT_USERNAME and NJIT_PASSWORD to .env file');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Request logging middleware
app.use(logger.requestLogger);

// In-memory storage for course data
let courseScheduleData = [];
let roomAvailability = {};
let lastUpdated = null;

// Parse course schedule from NJIT
async function fetchCourseSchedule() {
  try {
    // Try authenticated scraping if credentials are available
    if (USE_NJIT_AUTH) {
      try {
        logger.dataRefresh('Attempting authenticated NJIT scraping...');
        const { scrapeNJITWithAuth } = require('./njit-scraper');
        
        const result = await scrapeNJITWithAuth(
          process.env.NJIT_USERNAME,
          process.env.NJIT_PASSWORD
        );
        
        if (result.success && result.courses.length > 0) {
          courseScheduleData = result.courses;
          lastUpdated = new Date();
          calculateRoomAvailability(result.courses);
          
          logger.dataRefresh(`Successfully scraped ${result.courses.length} courses from NJIT`, {
            courses: result.courses.length,
            rooms: result.rooms.length,
            source: 'njit-authenticated'
          });
          
          return {
            success: true,
            courses: result.courses.length,
            source: 'njit-authenticated',
            lastUpdated
          };
        }
      } catch (authError) {
        logger.error('[DataRefresh] - Authenticated scraping failed, trying basic method', {
          error: authError.message
        });
      }
    }
    
    // Fallback to basic scraping (original method)
    logger.dataRefresh('Fetching course schedule from NJIT...');
    const response = await axios.get('https://generalssb-prod.ec.njit.edu/BannerExtensibility/customPage/page/stuRegCrseSched', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    
    const courses = [];
    const rooms = new Set();
    
    // Parse tables - the NJIT site uses tables with tbody
    $('table tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      
      // Skip header rows and rows without enough cells
      if (cells.length >= 12) {
        const section = $(cells[0]).text().trim();
        const crn = $(cells[1]).text().trim();
        const days = $(cells[2]).text().trim();
        const times = $(cells[3]).text().trim();
        const location = $(cells[4]).text().trim();
        const status = $(cells[5]).text().trim();
        const maxStudents = $(cells[6]).text().trim();
        const enrolled = $(cells[7]).text().trim();
        const instructor = $(cells[8]).text().trim();
        const mode = $(cells[9]).text().trim();
        
        // Only add if we have valid location and time data
        if (location && 
            location !== 'Location' && 
            location !== 'TBA' && 
            location !== '' &&
            times && 
            times !== 'TBA' && 
            times !== 'Times' &&
            times !== '' &&
            crn &&
            crn !== 'CRN') {
          
          courses.push({
            section,
            crn,
            days,
            times,
            location,
            status,
            maxStudents: parseInt(maxStudents) || 0,
            enrolled: parseInt(enrolled) || 0,
            instructor,
            deliveryMode: mode
          });
          rooms.add(location);
          
          console.log(`Found: ${location} - ${times} - ${days}`);
        }
      }
    });
    
    // Also try alternative table structure without tbody
    if (courses.length === 0) {
      console.log('Trying alternative parsing method...');
      $('table tr').each((i, row) => {
        const cells = $(row).find('td');
        
        if (cells.length >= 10) {
          const section = $(cells[0]).text().trim();
          const crn = $(cells[1]).text().trim();
          const days = $(cells[2]).text().trim();
          const times = $(cells[3]).text().trim();
          const location = $(cells[4]).text().trim();
          const status = $(cells[5]).text().trim();
          const maxStudents = $(cells[6]).text().trim();
          const enrolled = $(cells[7]).text().trim();
          const instructor = $(cells[8]).text().trim();
          const mode = $(cells[9]).text().trim();
          
          if (location && 
              location !== 'Location' && 
              location !== 'TBA' && 
              location !== '' &&
              times && 
              times !== 'TBA' && 
              times !== 'Times' &&
              crn &&
              crn !== 'CRN') {
            
            courses.push({
              section,
              crn,
              days,
              times,
              location,
              status,
              maxStudents: parseInt(maxStudents) || 0,
              enrolled: parseInt(enrolled) || 0,
              instructor,
              deliveryMode: mode
            });
            rooms.add(location);
          }
        }
      });
    }
    
    // If no courses found, throw error to use sample data
    if (courses.length === 0) {
      throw new Error('No courses found from NJIT site - check HTML structure');
    }
    
    courseScheduleData = courses;
    lastUpdated = new Date();
    calculateRoomAvailability(courses);
    
    logger.dataRefresh(`Fetched ${courses.length} courses from NJIT`, { 
      courses: courses.length, 
      rooms: rooms.size,
      source: 'njit'
    });
    return { success: true, count: courses.length, rooms: rooms.size, source: 'njit' };
  } catch (error) {
    logger.error('DataRefresh', `Failed to fetch NJIT data: ${error.message}`, { 
      error: error.message,
      stack: error.stack 
    });
    logger.dataRefresh('Loading sample data as fallback', { reason: 'NJIT fetch failed' });
    courseScheduleData = sampleData;
    lastUpdated = new Date();
    calculateRoomAvailability(sampleData);
    logger.dataRefresh(`Loaded ${sampleData.length} sample courses`, {
      courses: sampleData.length,
      source: 'sample',
      buildings: new Set(sampleData.map(c => c.location.split(' ')[0])).size
    });
    return { success: true, count: sampleData.length, usingSampleData: true, source: 'sample' };
  }
}

// Calculate room availability based on current time
function calculateRoomAvailability(courses) {
  const startTime = Date.now();
  const now = new Date();
  const currentDay = ['Su', 'M', 'T', 'W', 'R', 'F', 'S'][now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  logger.roomAvailability('Calculating room availability', {
    totalRooms: courses.length,
    currentDay,
    currentTime: now.toISOString()
  });
  
  // Map of all rooms with their status
  const roomStatus = {};
  
  courses.forEach(course => {
    const { location, days, times } = course;
    
    if (!roomStatus[location]) {
      roomStatus[location] = {
        room: location,
        isAvailable: true,
        currentClass: null,
        nextClass: null,
        allSchedule: []
      };
    }
    
    // Parse time (e.g., "1:00 PM - 2:20 PM")
    const timeMatch = times.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/);
    if (timeMatch) {
      const startHour = parseInt(timeMatch[1]) + (timeMatch[3] === 'PM' && timeMatch[1] !== '12' ? 12 : 0);
      const startMin = parseInt(timeMatch[2]);
      const endHour = parseInt(timeMatch[4]) + (timeMatch[6] === 'PM' && timeMatch[4] !== '12' ? 12 : 0);
      const endMin = parseInt(timeMatch[5]);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      roomStatus[location].allSchedule.push({
        days,
        startTime: times.split(' - ')[0],
        endTime: times.split(' - ')[1],
        startMinutes,
        endMinutes,
        course: course
      });
      
      // Check if class is happening now
      if (days.includes(currentDay) && currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        roomStatus[location].isAvailable = false;
        roomStatus[location].currentClass = course;
      }
    }
  });
  
  // Sort schedules by start time
  Object.keys(roomStatus).forEach(room => {
    roomStatus[room].allSchedule.sort((a, b) => a.startMinutes - b.startMinutes);
    
    // Find next class
    const upcomingClasses = roomStatus[room].allSchedule.filter(
      sched => sched.days.includes(currentDay) && sched.startMinutes > currentMinutes
    );
    if (upcomingClasses.length > 0) {
      roomStatus[room].nextClass = upcomingClasses[0];
    }
  });
  
  roomAvailability = roomStatus;
  
  const duration = Date.now() - startTime;
  const available = Object.values(roomStatus).filter(r => r.isAvailable).length;
  const occupied = Object.values(roomStatus).filter(r => !r.isAvailable).length;
  
  logger.roomAvailability('Room availability calculated', {
    available,
    occupied,
    total: Object.keys(roomStatus).length,
    calculationTime: `${duration}ms`
  });
}

// API Routes

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    lastUpdated,
    count: courseScheduleData.length,
    courses: courseScheduleData
  });
});

// Get room availability
app.get('/api/rooms/availability', (req, res) => {
  calculateRoomAvailability(courseScheduleData); // Recalculate for current time
  
  const availableRooms = Object.values(roomAvailability).filter(r => r.isAvailable);
  const occupiedRooms = Object.values(roomAvailability).filter(r => !r.isAvailable);
  
  res.json({
    success: true,
    timestamp: new Date(),
    summary: {
      total: Object.keys(roomAvailability).length,
      available: availableRooms.length,
      occupied: occupiedRooms.length
    },
    availableRooms,
    occupiedRooms
  });
});

// Get specific room status
app.get('/api/rooms/:roomName', (req, res) => {
  calculateRoomAvailability(courseScheduleData);
  const roomName = decodeURIComponent(req.params.roomName);
  const room = roomAvailability[roomName];
  
  if (room) {
    res.json({ success: true, room });
  } else {
    res.status(404).json({ success: false, error: 'Room not found' });
  }
});

// Get all buildings
app.get('/api/buildings', (req, res) => {
  const buildings = {};
  
  courseScheduleData.forEach(course => {
    const building = course.location.split(' ')[0]; // e.g., "KUPF" from "KUPF 207"
    if (!buildings[building]) {
      buildings[building] = {
        name: building,
        rooms: new Set()
      };
    }
    buildings[building].rooms.add(course.location);
  });
  
  // Convert Sets to arrays
  const buildingList = Object.keys(buildings).map(key => ({
    name: key,
    rooms: Array.from(buildings[key].rooms),
    roomCount: buildings[key].rooms.size
  }));
  
  res.json({
    success: true,
    count: buildingList.length,
    buildings: buildingList
  });
});

// Force refresh data
app.post('/api/refresh', async (req, res) => {
  const result = await fetchCourseSchedule();
  res.json(result);
});

// Upload CSV file for manual import
app.post('/api/import/csv', express.text({ type: 'text/csv' }), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { importFromCSV } = require('./csv-importer');
    
    // Save uploaded CSV temporarily
    const tempFile = path.join(__dirname, 'temp-upload.csv');
    fs.writeFileSync(tempFile, req.body);
    
    // Import from CSV
    const result = await importFromCSV(tempFile);
    
    if (result.success) {
      courseScheduleData = result.courses;
      lastUpdated = new Date();
      calculateRoomAvailability(result.courses);
      
      // Clean up temp file
      fs.unlinkSync(tempFile);
      
      logger.info('[CSV Import] - Successfully imported courses', {
        courses: result.courses.length,
        rooms: result.rooms.length
      });
      
      res.json({
        success: true,
        message: `Successfully imported ${result.courses.length} courses`,
        courses: result.courses.length,
        rooms: result.rooms.length,
        lastUpdated
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to import CSV'
      });
    }
  } catch (error) {
    logger.error('[CSV Import] - Upload failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Outlet routes
const outletRoutes = require('./routes/outlets');
app.use('/api/outlets', outletRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    lastUpdated,
    coursesLoaded: courseScheduleData.length
  });
});

// Schedule automatic refresh every hour
cron.schedule('0 * * * *', () => {
  logger.info('Scheduler', 'Running scheduled course data refresh...');
  fetchCourseSchedule();
});

// Error handling middleware (must be last)
app.use(logger.errorLogger);

// Initial data fetch on startup
fetchCourseSchedule().then(() => {
  app.listen(PORT, () => {
    logger.startup(PORT, process.env.NODE_ENV || 'development');
    logger.info('Server', `Loaded ${courseScheduleData.length} courses`);
    logger.info('Server', 'Auto-refresh scheduled every hour');
    console.log(`🚀 CampusSpace Backend running on http://localhost:${PORT}`);
    console.log(`📊 Loaded ${courseScheduleData.length} courses`);
    console.log(`🔄 Auto-refresh scheduled every hour`);
    console.log(`📝 Logs available at: logs/`);
  });
});

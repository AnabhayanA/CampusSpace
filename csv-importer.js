const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const logger = require('./utils/logger');

/**
 * Import courses from CSV file
 * Expected CSV format:
 * CRN,Subject,Course,Section,Title,Days,Times,Location,Instructor,Credits
 */
async function importFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const courses = [];
    const rooms = new Set();
    
    logger.info('[CSV Import] - Starting import from', { file: filePath });
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Clean and validate data
        const location = (row.Location || row.location || '').trim();
        const times = (row.Times || row.times || row.Time || row.time || '').trim();
        const crn = (row.CRN || row.crn || '').trim();
        
        if (location && location !== 'TBA' && times && times !== 'TBA' && crn) {
          const course = {
            crn,
            subject: (row.Subject || row.subject || '').trim(),
            course: (row.Course || row.course || '').trim(),
            section: (row.Section || row.section || '').trim(),
            title: (row.Title || row.title || '').trim(),
            days: (row.Days || row.days || '').trim(),
            times,
            location,
            instructor: (row.Instructor || row.instructor || '').trim(),
            credits: (row.Credits || row.credits || '').trim()
          };
          
          courses.push(course);
          rooms.add(location);
        }
      })
      .on('end', () => {
        logger.info('[CSV Import] - Import completed', {
          courses: courses.length,
          rooms: rooms.size
        });
        
        resolve({
          success: true,
          courses,
          rooms: Array.from(rooms),
          importedAt: new Date()
        });
      })
      .on('error', (error) => {
        logger.error('[CSV Import] - Import failed', {
          error: error.message
        });
        reject(error);
      });
  });
}

/**
 * Import courses from JSON file
 */
async function importFromJSON(filePath) {
  try {
    logger.info('[JSON Import] - Starting import from', { file: filePath });
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const courses = Array.isArray(data) ? data : data.courses || [];
    const rooms = new Set();
    
    courses.forEach(course => {
      if (course.location) {
        rooms.add(course.location);
      }
    });
    
    logger.info('[JSON Import] - Import completed', {
      courses: courses.length,
      rooms: rooms.size
    });
    
    return {
      success: true,
      courses,
      rooms: Array.from(rooms),
      importedAt: new Date()
    };
  } catch (error) {
    logger.error('[JSON Import] - Import failed', {
      error: error.message
    });
    throw error;
  }
}

/**
 * Export current courses to CSV
 */
function exportToCSV(courses, outputPath) {
  try {
    logger.info('[CSV Export] - Starting export to', { file: outputPath });
    
    // Create CSV header
    const header = 'CRN,Subject,Course,Section,Title,Days,Times,Location,Instructor,Credits\n';
    
    // Create CSV rows
    const rows = courses.map(course => {
      return [
        course.crn || '',
        course.subject || '',
        course.course || '',
        course.section || '',
        course.title || '',
        course.days || '',
        course.times || '',
        course.location || '',
        course.instructor || '',
        course.credits || ''
      ].map(field => `"${field}"`).join(',');
    });
    
    const csv = header + rows.join('\n');
    
    fs.writeFileSync(outputPath, csv, 'utf8');
    
    logger.info('[CSV Export] - Export completed', {
      courses: courses.length,
      file: outputPath
    });
    
    return { success: true, file: outputPath };
  } catch (error) {
    logger.error('[CSV Export] - Export failed', {
      error: error.message
    });
    throw error;
  }
}

module.exports = {
  importFromCSV,
  importFromJSON,
  exportToCSV
};

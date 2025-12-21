const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const logger = require('./utils/logger');

/**
 * Scrape NJIT course schedule using authenticated browser session
 * This requires NJIT credentials (UCID and password)
 */
async function scrapeNJITWithAuth(username, password) {
  let browser = null;
  
  try {
    // Check if puppeteer is installed
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (e) {
      throw new Error('Puppeteer not installed. Run: npm install puppeteer');
    }
    
    logger.info('[NJIT Scraper] - Starting authenticated scraping session');
    
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new', // Use new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    logger.info('[NJIT Scraper] - Navigating to course schedule page');
    
    // Navigate to course schedule page
    await page.goto('https://generalssb-prod.ec.njit.edu/BannerExtensibility/customPage/page/stuRegCrseSched', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a moment for redirect to login page
    await page.waitForTimeout(2000);
    
    // Check if we need to login
    const currentUrl = page.url();
    logger.info('[NJIT Scraper] - Current URL after initial load', { url: currentUrl });
    
    if (currentUrl.includes('login') || currentUrl.includes('auth') || currentUrl.includes('sso')) {
      logger.info('[NJIT Scraper] - Login required, attempting authentication');
      
      // Wait for username field
      await page.waitForSelector('input[type="text"], input[name="username"], input[id="username"]', { timeout: 10000 });
      
      // Fill in username
      await page.type('input[type="text"], input[name="username"], input[id="username"]', username);
      logger.info('[NJIT Scraper] - Entered username');
      
      // Fill in password
      await page.type('input[type="password"], input[name="password"], input[id="password"]', password);
      logger.info('[NJIT Scraper] - Entered password');
      
      // Click login button
      await page.click('button[type="submit"], input[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
      logger.info('[NJIT Scraper] - Submitted login form');
      
      // Wait for navigation after login
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      
      logger.info('[NJIT Scraper] - Login successful, navigating to course schedule');
      
      // Navigate back to course schedule if needed
      const afterLoginUrl = page.url();
      if (!afterLoginUrl.includes('stuRegCrseSched')) {
        await page.goto('https://generalssb-prod.ec.njit.edu/BannerExtensibility/customPage/page/stuRegCrseSched', {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
      }
    }
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'logs/njit-page.png', fullPage: true });
    logger.info('[NJIT Scraper] - Screenshot saved to logs/njit-page.png');
    
    // Get page content
    const html = await page.content();
    
    // Parse with Cheerio
    const $ = cheerio.load(html);
    const courses = [];
    const rooms = new Set();
    
    logger.info('[NJIT Scraper] - Parsing course data from HTML');
    
    // Try multiple table selectors
    const tableSelectors = [
      'table.dataTable tbody tr',
      'table tbody tr',
      'table tr',
      '.schedule-table tbody tr',
      '[class*="schedule"] tbody tr'
    ];
    
    for (const selector of tableSelectors) {
      const rows = $(selector);
      logger.info(`[NJIT Scraper] - Trying selector: ${selector}, found ${rows.length} rows`);
      
      if (rows.length > 0) {
        rows.each((i, row) => {
          const cells = $(row).find('td');
          
          if (cells.length >= 8) {
            const courseData = {
              crn: $(cells[0]).text().trim(),
              subject: $(cells[1]).text().trim(),
              course: $(cells[2]).text().trim(),
              section: $(cells[3]).text().trim(),
              title: $(cells[4]).text().trim(),
              days: $(cells[5]).text().trim(),
              times: $(cells[6]).text().trim(),
              location: $(cells[7]).text().trim(),
              instructor: $(cells[8]) ? $(cells[8]).text().trim() : '',
              credits: $(cells[9]) ? $(cells[9]).text().trim() : ''
            };
            
            // Only add valid courses with location and time
            if (courseData.location && 
                courseData.location !== 'TBA' && 
                courseData.location !== '' &&
                courseData.times &&
                courseData.times !== 'TBA' &&
                courseData.crn &&
                courseData.crn !== 'CRN') {
              
              courses.push(courseData);
              rooms.add(courseData.location);
            }
          }
        });
        
        if (courses.length > 0) {
          logger.info(`[NJIT Scraper] - Successfully parsed ${courses.length} courses`);
          break;
        }
      }
    }
    
    // If still no courses, save HTML for debugging
    if (courses.length === 0) {
      const fs = require('fs');
      fs.writeFileSync('logs/njit-page.html', html);
      logger.warn('[NJIT Scraper] - No courses found, HTML saved to logs/njit-page.html for debugging');
    }
    
    await browser.close();
    
    logger.info('[NJIT Scraper] - Scraping completed', {
      courses: courses.length,
      rooms: rooms.size
    });
    
    return {
      success: courses.length > 0,
      courses,
      rooms: Array.from(rooms),
      scrapedAt: new Date()
    };
    
  } catch (error) {
    logger.error('[NJIT Scraper] - Scraping failed', {
      error: error.message,
      stack: error.stack
    });
    
    if (browser) {
      await browser.close();
    }
    
    throw error;
  }
}

/**
 * Scrape NJIT public course catalog (if available)
 * This doesn't require authentication
 */
async function scrapeNJITPublic() {
  let browser = null;
  
  try {
    logger.info('[NJIT Scraper] - Attempting public catalog scraping');
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Try public course search page
    const publicUrl = 'https://catalog.njit.edu/courses/';
    await page.goto(publicUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Parse public catalog
    // This will vary based on NJIT's public catalog structure
    const courses = [];
    
    // Add parsing logic based on actual page structure
    
    await browser.close();
    
    return {
      success: courses.length > 0,
      courses,
      scrapedAt: new Date()
    };
    
  } catch (error) {
    logger.error('[NJIT Scraper] - Public scraping failed', {
      error: error.message
    });
    
    if (browser) {
      await browser.close();
    }
    
    return { success: false, courses: [], error: error.message };
  }
}

module.exports = {
  scrapeNJITWithAuth,
  scrapeNJITPublic
};

# 🎓 Getting Real NJIT Classroom Data

## Quick Start (Choose One Method)

### ⚡ Method 1: Automated with NJIT Login (RECOMMENDED)

**This gives you REAL-TIME data automatically!**

1. **Install dependencies** (if not already done):
```bash
npm install puppeteer dotenv csv-parser
```

2. **Create credentials file**:
```bash
cp .env.example .env
```

3. **Edit `.env` file and add your NJIT credentials**:
```bash
nano .env
```

Add your UCID and password:
```
NJIT_USERNAME=your_ucid
NJIT_PASSWORD=your_password
```

4. **Restart the server**:
```bash
npm start
```

**That's it!** The server will automatically:
- Log into NJIT with your credentials
- Scrape real classroom data
- Update every hour automatically
- Fall back to sample data if login fails

### 📁 Method 2: Manual CSV Upload (No Login Required)

If you don't want to provide credentials, you can manually upload course data:

1. **Get course schedule from NJIT**:
   - Log into NJIT Banner
   - Go to Course Schedule
   - Export or copy the data

2. **Create a CSV file** (`courses.csv`):
```csv
CRN,Subject,Course,Section,Title,Days,Times,Location,Instructor,Credits
12345,CS,100,001,Intro to CS,MW,10:00-11:15,KUPF 207,John Doe,3
12346,CS,101,002,Data Structures,TR,14:00-15:15,GITC 3710,Jane Smith,3
```

3. **Upload via API**:
```bash
curl -X POST http://localhost:3000/api/import/csv \
  -H "Content-Type: text/csv" \
  --data-binary @courses.csv
```

Or use the web interface (coming soon).

---

## 🔒 Security Notes

### Is it safe to provide NJIT credentials?

**Your credentials are:**
- ✅ Stored ONLY on your local machine (in `.env` file)
- ✅ NEVER sent to any external server
- ✅ NEVER logged or saved anywhere else
- ✅ Used ONLY to access NJIT's course schedule
- ✅ Can be removed anytime by deleting `.env`

**The `.env` file is:**
- Listed in `.gitignore` (won't be committed to git)
- Only readable by you on your machine
- Used the same way as password managers

### Alternative: Use a throwaway account
If you're still concerned, create a separate NJIT account just for this app.

---

## 🎯 What You Get

### With Authenticated Scraping:
- ✅ **Real-time data** - Always up-to-date classroom schedules
- ✅ **Automatic updates** - Refreshes every hour
- ✅ **All courses** - Complete NJIT course catalog
- ✅ **Accurate times** - Real class times and locations
- ✅ **Current semester** - Always the latest schedule

### Sample Data vs Real Data:

**Sample Data (current):**
- 27 courses
- 8 buildings
- Fake schedule data
- Good for testing only

**Real NJIT Data (with login):**
- 1000+ courses
- All NJIT buildings
- Real class times
- Real instructor names
- Production ready!

---

## 🛠️ Troubleshooting

### "Puppeteer installation failed"
```bash
# Install Chromium dependencies (Ubuntu/Debian)
sudo apt-get install -y \
  chromium-browser \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libatk1.0-0 \
  libgtk-3-0

# Then reinstall
npm install puppeteer
```

### "Login failed"
- Check your UCID and password in `.env`
- Make sure no extra spaces
- Try logging into NJIT Banner manually first
- Check if NJIT changed their login page

### "No courses found"
- Wait 30 seconds for the scraper
- Check `logs/njit-page.png` to see what was scraped
- Check `logs/njit-page.html` for the raw HTML
- NJIT may have changed their page structure

### "Server won't start"
```bash
# Check if already running
pkill -f "node server.js"

# Restart
npm start
```

---

## 📊 Verify It's Working

### Check the logs:
```bash
tail -f logs/app.log
```

Look for:
```
[INFO] [NJIT Scraper] - Starting authenticated scraping session
[INFO] [NJIT Scraper] - Login successful
[INFO] [DataRefresh] - Successfully scraped 1234 courses from NJIT
```

### Check the API:
```bash
curl http://localhost:3000/api/health
```

Should show:
```json
{
  "success": true,
  "coursesLoaded": 1234,  // <-- Real number, not 27!
  "lastUpdated": "2025-12-21T..."
}
```

### Check the dashboard:
Open `http://localhost:3000/dashboard.html` and look at the buildings dropdown - you should see ALL NJIT buildings, not just the 8 sample ones.

---

## 🔄 Auto-Update Schedule

The scraper automatically runs:
- ✅ On server startup
- ✅ Every hour (cron job)
- ✅ When you hit `/api/refresh`

You can change the schedule in `server.js`:
```javascript
// Change from hourly to every 30 minutes:
cron.schedule('*/30 * * * *', () => {
  fetchCourseSchedule();
});
```

---

## 🚀 Next Steps

### Once you have real data:

1. **Test the dashboard** - All rooms should show real data
2. **Check availability** - Green/red indicators should be accurate
3. **Test filters** - Filter by building, time, availability
4. **Add outlets** - Now add outlet tracking to buildings
5. **Deploy** - Host on a server for other students to use

### Future Improvements:

1. **Multi-semester support** - Store historical data
2. **Professor ratings** - Integrate with RateMyProfessor
3. **Notifications** - Alert when a room becomes available
4. **Mobile app** - React Native version
5. **AI predictions** - Predict room availability patterns

---

## 📧 Need Help?

### If login doesn't work:
1. Try the CSV upload method instead
2. Contact NJIT IT for API access (see NJIT-DATA-ACCESS.md)
3. Check GitHub issues for similar problems

### To get official API access:
Email NJIT IT: ist-help@njit.edu

Template:
```
Subject: API Access Request for Student Classroom Finder

I'm developing CampusSpace, a tool to help students find available 
classrooms. Could you provide API access to course schedule data?

Thank you!
```

---

## ✅ Current Status

After setup, your backend will have:
- ✅ Real NJIT course data (1000+ courses)
- ✅ All campus buildings
- ✅ Accurate room availability
- ✅ Real-time updates
- ✅ Automatic hourly refresh
- ✅ Fallback to sample data if needed
- ✅ MongoDB for outlet tracking
- ✅ Comprehensive logging
- ✅ Production ready!

**Just add your NJIT credentials to `.env` and restart!**

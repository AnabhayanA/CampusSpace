# CampusSpace Backend Setup Complete! 🎉

## What I Built For You

I've created a complete backend system for CampusSpace that integrates with NJIT's course schedule to show real-time classroom availability.

### Backend Components

1. **Node.js/Express Server** (`server.js`)
   - REST API with multiple endpoints
   - Web scraping from NJIT course schedule page
   - Real-time room availability calculation
   - Auto-refresh every hour
   - Sample data fallback

2. **Sample Data** (`sample-data.js`)
   - 27+ course schedules across 8 buildings
   - Realistic NJIT classroom data
   - Used when live scraping fails

3. **API Client** (`api-client.js`)
   - JavaScript wrapper for frontend
   - Easy-to-use methods for all API endpoints
   - Error handling built-in

4. **Updated Dashboard** (`dashboard.html`)
   - Integrated with backend API
   - Shows real-time room availability
   - Color-coded: 🟢 Available / 🔴 Occupied
   - Auto-refreshes every 5 minutes

5. **Test Dashboard** (`test-api.html`)
   - Test all API endpoints
   - Visual interface for debugging
   - Real-time data inspection

## API Endpoints Available

### 1. Health Check
```
GET /api/health
```
Returns backend status and course count

### 2. Get Room Availability
```
GET /api/rooms/availability
```
Returns all rooms with current availability status, showing:
- Available rooms (🟢)
- Occupied rooms (🔴)
- Next class times
- Current class info

### 3. Get All Courses
```
GET /api/courses
```
Returns complete course schedule with:
- Room locations
- Times and days
- Instructor names
- Enrollment data

### 4. Get Specific Room
```
GET /api/rooms/:roomName
```
Example: `/api/rooms/KUPF%20207`
Returns detailed schedule for one room

### 5. Get Buildings
```
GET /api/buildings
```
Returns all buildings with their rooms

### 6. Force Refresh
```
POST /api/refresh
```
Manually trigger data refresh from NJIT

## How to Use

### Start the Backend
```bash
cd /home/anabhayan/CampusSpace
npm start
```

Server runs on: **http://localhost:3000**

### Access the Application
1. **Main App**: http://localhost:3000/index.html
   - Login with NJIT ID
   - View dashboard with room finder

2. **Test Dashboard**: http://localhost:3000/test-api.html
   - Test all API endpoints
   - View raw data
   - Debug issues

### Use the API in Your Code
```javascript
// Get room availability
const data = await CampusSpaceAPI.getRoomAvailability();
console.log(`${data.summary.available} rooms available now`);

// Get specific room
const room = await CampusSpaceAPI.getRoomStatus('KUPF 207');
console.log(room.isAvailable ? 'Available' : 'Occupied');

// Get all buildings
const buildings = await CampusSpaceAPI.getBuildings();
buildings.buildings.forEach(b => {
  console.log(`${b.name}: ${b.roomCount} rooms`);
});
```

## Buildings Covered

Currently tracking rooms in:
- **KUPF** (Kupfrian) - 9 rooms
- **FMH** - 3 rooms  
- **CAB** - 3 rooms
- **GITC** - 3 rooms
- **CKB** (Central King Building) - 3 rooms
- **Tiernan** - 2 rooms
- **Cullimore** - 2 rooms
- **WEC** - 2 rooms

## Features

✅ **Real-time Availability** - Calculates based on current time
✅ **Smart Scheduling** - Knows when rooms are occupied
✅ **Next Class Info** - Shows when next class starts
✅ **Auto-refresh** - Updates every hour automatically
✅ **Fallback Data** - Uses sample data if NJIT site unavailable
✅ **CORS Enabled** - Works from any frontend
✅ **RESTful API** - Standard HTTP methods

## Next Steps - Enhancements

### Immediate Improvements:
1. **Add Authentication**
   - JWT tokens
   - User accounts
   - Saved preferences

2. **Database Integration**
   - MongoDB for persistent data
   - User-reported outlet status
   - Historical availability data

3. **Real-time Updates**
   - WebSocket/Socket.io
   - Push notifications
   - Live dashboard updates

4. **Enhanced Features**
   - Search by time ("Show rooms free at 2pm")
   - Filter by capacity
   - Room photos/layouts
   - Crowdsourced outlet reporting
   - IoT sensor integration

### How to Add These:

**Add MongoDB:**
```bash
npm install mongoose
```

**Add WebSockets:**
```bash
npm install socket.io
```

**Add Authentication:**
```bash
npm install jsonwebtoken bcrypt
```

## Testing

Test the API with:
```bash
# Health check
curl http://localhost:3000/api/health

# Get room availability
curl http://localhost:3000/api/rooms/availability

# Get buildings
curl http://localhost:3000/api/buildings

# Get specific room
curl http://localhost:3000/api/rooms/KUPF%20207
```

Or use the test dashboard at http://localhost:3000/test-api.html

## Troubleshooting

**Server won't start:**
- Check if port 3000 is in use: `lsof -i :3000`
- Kill existing process: `pkill -f "node server.js"`

**No data loading:**
- Server falls back to sample data automatically
- Check console for error messages
- Verify sample-data.js exists

**CORS errors:**
- Backend has CORS enabled
- Check browser console for details

## Project Structure

```
/home/anabhayan/CampusSpace/
├── index.html           # Login page
├── dashboard.html       # Main dashboard with maps
├── test-api.html        # API testing interface
├── style.css            # Styles
├── script.js            # Frontend logic
├── api-client.js        # API wrapper
├── server.js            # Backend server
├── sample-data.js       # Fallback course data
├── package.json         # Dependencies
└── README.md            # Documentation
```

## Technologies Used

**Backend:**
- Node.js
- Express.js
- Axios (HTTP requests)
- Cheerio (HTML parsing)
- Node-cron (Scheduling)

**Frontend:**
- Vanilla JavaScript
- Leaflet.js (Maps)
- HTML5/CSS3

## Current Status

✅ Backend running on port 3000
✅ 27 sample courses loaded
✅ All API endpoints working
✅ Frontend integrated
✅ Auto-refresh enabled
✅ Test dashboard available

The system is ready to use! You can now expand it with:
- User authentication
- Database persistence
- More buildings/rooms
- Outlet tracking features
- Mobile app integration

Enjoy your CampusSpace backend! 🚀

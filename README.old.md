# CampusSpace

CampusSpace is a smart web and mobile app that helps students find available classrooms and working outlets in real time. Whether you need to study, charge your laptop, or relax, CampusSpace shows which rooms are free and which outlets are available, in use, or broken, combining crowdsourced reports with IoT sensor data for accurate updates.

## Features

- 🏫 **Real-time Classroom Availability** - Fetches live course schedule data from NJIT
- ⚡ **Outlet Finder & Tracking** - Locate and track available power outlets across campus
- 🗺️ **Interactive Campus Map** - Visual map with building locations
- 📅 **Schedule Integration** - Shows current and upcoming class schedules
- 🔄 **Auto-refresh** - Data updates automatically every hour
- 📊 **Crowdsourced Reports** - Users can report outlet status
- 🔌 **Hardware Integration** - Support for IoT sensors to track outlet usage
- 📝 **Comprehensive Logging** - Monitor all operations with detailed logs
- 🗄️ **MongoDB Database** - Persistent storage for outlets and rooms

## Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap 5.3.2 for responsive UI
- Leaflet.js for interactive maps
- Bootstrap Icons

**Backend:**
- Node.js + Express
- MongoDB + Mongoose ODM
- Axios for web scraping
- Cheerio for HTML parsing
- Node-cron for scheduled tasks
- Custom logging system

## Installation

1. **Install Node.js** (if not already installed)
   ```bash
   # Check if Node.js is installed
   node --version
   ```

2. **Install MongoDB** (optional - for persistent database)
   
   **On Ubuntu/Debian:**
   ```bash
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   ```
   
   **On macOS:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```
   
   **Or use MongoDB Atlas** (cloud database):
   - Create account at https://www.mongodb.com/cloud/atlas
   - Set `MONGODB_URI` environment variable
   
   > **Note:** The app will run without MongoDB using in-memory storage for demo purposes

3. **Install Dependencies**
   ```bash
   npm install
   ```

## Running the Application

1. **Start MongoDB** (if using local database)
   ```bash
   sudo systemctl start mongodb   # Linux
   brew services start mongodb-community   # macOS
   ```

2. **Seed Outlet Data** (optional - first time only)
   ```bash
   npm run seed-outlets
   ```

3. **Start the Backend Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

4. **Open the Frontend**
   - Navigate to `http://localhost:3000`
   - Or open `index.html` in your browser

## API Endpoints

### Room Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/rooms/availability` - Get real-time room availability
- `GET /api/rooms/:roomName` - Get specific room status
- `GET /api/buildings` - Get all buildings with rooms
- `POST /api/refresh` - Force refresh data from NJIT
- `GET /api/health` - Backend health check

### Outlet Endpoints
- `GET /api/outlets` - Get all outlets (with optional filters)
- `GET /api/outlets/available` - Get available outlets only
- `GET /api/outlets/location/:building/:floor` - Get outlets by location
- `GET /api/outlets/:id` - Get specific outlet
- `POST /api/outlets` - Create new outlet
- `PUT /api/outlets/:id` - Update outlet
- `POST /api/outlets/:id/hardware-update` - Hardware sensor update
- `POST /api/outlets/:id/report` - Add user report
- `DELETE /api/outlets/:id` - Delete outlet
- `GET /api/outlets/stats/summary` - Get outlet statistics

See [Outlet API Documentation](docs/OUTLET-API.md) for detailed information.

## Usage

1. **Login** - Enter your NJIT ID on the login page
2. **Dashboard** - Choose between finding a classroom or an outlet
3. **Interactive Map** - Click on buildings to see available rooms/outlets
4. **Real-time Status** - See which rooms are currently available (🟢) or occupied (🔴)

## Data Source

Course schedule data is fetched from NJIT's Banner system:
`https://generalssb-prod.ec.njit.edu/BannerExtensibility/customPage/page/stuRegCrseSched`

## Auto-refresh

- Backend refreshes course data every hour
- Frontend updates room availability every 5 minutes

## Development

To modify the backend, edit `server.js`. The server automatically:
- Scrapes NJIT course schedule
- Parses classroom locations and times
- Calculates room availability based on current time
- Provides REST API for frontend consumption

## Future Enhancements

- [ ] User accounts and authentication
- [ ] Crowdsourced outlet status reporting
- [ ] IoT sensor integration
- [ ] Push notifications for room availability
- [ ] Favorite rooms/locations
- [ ] Study group matching

## License

MIT

## Contributors

Built for students, by students 🎓

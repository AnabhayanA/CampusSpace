# CampusSpace 🎓

> A comprehensive real-time campus navigation system for NJIT students to find available classrooms and power outlets across campus.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🏢 Core Functionality
- **Real-time Classroom Finder**: Browse 27+ classrooms with live availability status
- **Interactive Campus Map**: Explore NJIT buildings with Leaflet.js integration
- **Power Outlet Locator**: Find and track 15+ power outlets across campus buildings
- **Building Information System**: Detailed floor plans and amenities
- **Smart Search & Filters**: Find exactly what you need instantly
- **Mobile-Responsive Design**: Seamless experience on all devices

### 🔌 Outlet Management System
- Live status tracking (Available, Occupied, Out of Service)
- User-generated reports for accuracy
- Admin verification system
- Filter by building, type (USB/Standard/USB-C), and status
- Map-based visualization with custom markers
- Real-time statistics dashboard

### 👨‍💼 Admin Dashboard
- Complete CRUD operations for outlets
- User report moderation
- Statistics and analytics
- Quick actions (add outlet, refresh data, export)
- Activity feed monitoring
- System log viewer integration

### 📡 NJIT Data Integration
- Authenticated web scraping with Puppeteer
- Automatic hourly data refresh
- CSV import fallback system
- Graceful degradation to sample data
- Secure credential management

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 14.0.0
MongoDB >= 4.4 (optional)
npm or yarn
```

### Installation

1. **Clone and install**
```bash
git clone https://github.com/yourusername/CampusSpace.git
cd CampusSpace
npm install
```

2. **Seed sample data**
```bash
npm run seed-outlets
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

That's it! The app runs with sample data by default.

### Optional: Enable NJIT Real-Time Data

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your NJIT credentials
NJIT_USERNAME=your_ucid
NJIT_PASSWORD=your_password
USE_NJIT_AUTH=true

# 3. Install Chrome dependencies (Linux)
sudo apt-get install chromium-browser libx11-6

# 4. Restart server
npm start
```

See [docs/REAL-DATA-SETUP.md](docs/REAL-DATA-SETUP.md) for detailed instructions.

## 📁 Project Structure

```
CampusSpace/
├── 📄 Frontend Pages
│   ├── index.html              # Landing page with hero
│   ├── dashboard.html          # Main interactive dashboard
│   ├── outlets.html            # Outlet finder page
│   ├── admin.html              # Admin management panel
│   └── logs-viewer.html        # System log viewer
│
├── 🔧 Backend
│   ├── server.js               # Main Express server
│   ├── njit-scraper.js         # Puppeteer authentication scraper
│   ├── csv-importer.js         # Manual data import utility
│   │
│   ├── models/
│   │   ├── Outlet.js           # Outlet schema + methods
│   │   └── Room.js             # Room schema + availability logic
│   │
│   └── routes/
│       ├── courseRoutes.js     # 6 classroom endpoints
│       └── outletRoutes.js     # 10 outlet endpoints
│
├── 📊 Data
│   ├── data/
│   │   ├── sample-courses.json # 27 course records
│   │   └── outlet-seed.js      # 15 outlet seed script
│   └── logs/                   # System logs (5 categories)
│
├── 📚 Documentation
│   ├── docs/
│   │   ├── NJIT-DATA-ACCESS.md
│   │   ├── REAL-DATA-SETUP.md
│   │   └── QUICK-START-REAL-DATA.md
│   └── README.md               # This file
│
├── 🎨 Assets
│   ├── style.css               # Global styles
│   ├── script.js               # Dashboard logic
│   └── assets/                 # Images & static files
│
└── ⚙️ Configuration
    ├── package.json
    ├── .env                    # Environment variables (gitignored)
    └── .env.example            # Template for .env
```

## 🌐 API Reference

### Classroom Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/schedule` | Get full course schedule | 27 courses |
| GET | `/api/schedule/available` | Currently available rooms | Filtered list |
| GET | `/api/schedule/building/:building` | Building-specific schedule | By building |
| GET | `/api/schedule/room/:room` | Room-specific schedule | Single room |
| GET | `/api/schedule/time/:day/:time` | Available at specific time | Time-based |
| POST | `/api/refresh` | Refresh from NJIT | Updated data |
| GET | `/api/rooms/:room` | Detailed room information | Room details |

### Outlet Endpoints

| Method | Endpoint | Description | Admin Only |
|--------|----------|-------------|------------|
| GET | `/api/outlets` | Get all outlets | No |
| GET | `/api/outlets/:id` | Get specific outlet | No |
| GET | `/api/outlets/building/:building` | Outlets by building | No |
| GET | `/api/outlets/available` | Available outlets only | No |
| POST | `/api/outlets` | Create new outlet | **Yes** |
| PUT | `/api/outlets/:id` | Update outlet | **Yes** |
| DELETE | `/api/outlets/:id` | Delete outlet | **Yes** |
| POST | `/api/outlets/:id/report` | Report issue | No |
| GET | `/api/outlets/stats/summary` | Statistics summary | No |
| GET | `/api/outlets/stats/by-building` | Stats by building | No |

### Example Requests

**Get available rooms:**
```bash
curl http://localhost:3000/api/schedule/available
```

**Get outlets in GITC:**
```bash
curl http://localhost:3000/api/outlets/building/GITC
```

**Report outlet issue:**
```bash
curl -X POST http://localhost:3000/api/outlets/OUTLET_ID/report \
  -H "Content-Type: application/json" \
  -d '{"status": "out-of-service", "comment": "Not working"}'
```

## 🛠️ Development

### Available Scripts

```bash
npm start              # Start server (port 3000)
npm run seed-outlets   # Seed 15 sample outlets
npm test              # Run tests (if configured)
npm run dev           # Development mode with nodemon (if configured)
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/campusspace

# NJIT Authentication (Optional)
NJIT_USERNAME=your_ucid
NJIT_PASSWORD=your_password
USE_NJIT_AUTH=false

# Logging
LOG_LEVEL=info
```

### Database Schema

**Outlet Model:**
```javascript
{
  outletId: String,        // Unique identifier
  building: String,        // Building name
  floor: Number,           // Floor number
  room: String,            // Room number
  type: String,            // standard, usb, usb-c, combination
  totalPorts: Number,      // Total available ports
  availablePorts: Number,  // Currently available
  status: String,          // available, occupied, out-of-service
  isVerified: Boolean,     // Admin verified
  lastChecked: Date,       // Last status update
  notes: String,           // Additional info
  reports: Array           // User reports
}
```

**Room Model:**
```javascript
{
  roomNumber: String,
  building: String,
  floor: Number,
  capacity: Number,
  hasProjector: Boolean,
  hasWhiteboard: Boolean,
  schedule: Array,
  availability: Object
}
```

## 🎨 Tech Stack Details

### Frontend Technologies
- **HTML5 & CSS3**: Modern semantic markup and styling
- **Bootstrap 5.3.2**: Responsive UI framework
- **Leaflet.js 1.9.4**: Interactive mapping library
- **Bootstrap Icons 1.11.1**: Icon library
- **Vanilla JavaScript ES6+**: No framework dependencies
- **Google Fonts (Poppins)**: Typography

### Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js 4.18.2**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Puppeteer**: Headless browser automation
- **Cheerio**: HTML parsing
- **dotenv**: Environment configuration
- **csv-parser**: CSV file handling

### Architecture Patterns
- RESTful API design
- MVC-inspired structure
- Middleware pattern
- Error handling with fallbacks
- Modular route organization
- Schema-based data validation

## 🔐 Security & Privacy

- Credentials stored in `.env` (gitignored)
- No sensitive data in client-side code
- Input validation on all endpoints
- MongoDB injection prevention via Mongoose
- Rate limiting ready (can be added)
- HTTPS ready for production

## 📊 Sample Data

The application comes with pre-seeded data:

- **27 Course Records**: Various buildings and times
- **15 Power Outlets**: Across KUPF, GITC, FMH, CULM, TIER, CKB
- **5 Buildings**: Major campus locations
- **Multiple Room Types**: Classrooms, labs, study spaces

Buildings included:
- Kupfrian Hall (KUPF)
- Guttenberg Information Technologies Center (GITC)
- Fenster Hall (FMH)
- Cullimore Hall (CULM)
- Tiernan Hall (TIER)
- Central King Building (CKB)

## 🐛 Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Kill existing process
pkill -f node

# Or use different port
PORT=4000 npm start
```

**2. MongoDB connection failed**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Or run without database (uses in-memory storage)
npm start
```

**3. Puppeteer scraping fails**
```bash
# Install Chrome dependencies (Linux)
sudo apt-get update
sudo apt-get install chromium-browser libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3

# Falls back to sample data automatically
```

**4. Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm start
```

View logs in browser:
```
http://localhost:3000/logs-viewer.html
```

## 📈 Performance

- **Server startup**: ~2 seconds
- **API response time**: <100ms (local MongoDB)
- **Page load time**: <2 seconds (first visit)
- **Map rendering**: <1 second
- **Database queries**: Optimized with indexes
- **Memory usage**: ~50MB (typical)

## 🚧 Roadmap & Future Features

### Phase 1: Real-Time Features
- [ ] WebSocket integration with Socket.io
- [ ] Live outlet status updates
- [ ] Real-time room availability changes
- [ ] Push notifications

### Phase 2: User Features
- [ ] User authentication & profiles
- [ ] Favorite locations
- [ ] Personalized schedules
- [ ] Social sharing features

### Phase 3: Mobile App
- [ ] React Native mobile app
- [ ] QR code scanning for quick check-in
- [ ] Offline mode support
- [ ] Location-based "nearest outlet" finder

### Phase 4: IoT Integration
- [ ] Smart outlet sensors
- [ ] Automated status updates
- [ ] Usage analytics
- [ ] Predictive availability

### Phase 5: Analytics
- [ ] Usage heatmaps
- [ ] Popular times analysis
- [ ] Building occupancy trends
- [ ] Admin analytics dashboard

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/CampusSpace.git
cd CampusSpace
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure mobile responsiveness

4. **Commit and push**
```bash
git add .
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

5. **Open a Pull Request**
- Describe your changes
- Reference any related issues
- Include screenshots if UI changes

### Code Style Guidelines

- **JavaScript**: ES6+, camelCase variables
- **HTML**: Semantic tags, proper indentation
- **CSS**: Mobile-first, BEM naming (optional)
- **Comments**: JSDoc for functions
- **File naming**: kebab-case for files

### Testing

Before submitting:
- [ ] Test all modified endpoints
- [ ] Check mobile responsiveness
- [ ] Verify database operations
- [ ] Review browser console for errors
- [ ] Test with and without MongoDB

## 📄 License

This project is licensed under the MIT License.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 👥 Authors

**Developed for NJIT Students**
- GitHub: [@AnabhayanA](https://github.com/AnabhayanA)

## 🙏 Acknowledgments

- **NJIT** for providing campus data access
- **Bootstrap Team** for the excellent UI framework
- **Leaflet.js** for interactive mapping capabilities
- **MongoDB Team** for the robust database system
- **Open Source Community** for various dependencies

##  Screenshots

### Landing Page
Modern hero section with gradient background and feature cards.

### Dashboard
Interactive map with classroom and outlet locations.

### Outlets Page
Dedicated outlet finder with filters, search, and reporting.

### Admin Panel
Complete management interface with statistics and CRUD operations.

## 🔄 Version History

### Version 2.0.0 (Current)
- ✨ Added admin dashboard
- ✨ Created dedicated outlets page
- ✨ Implemented NJIT authentication scraper
- ✨ Added comprehensive logging system
- 🔧 Improved API with 16+ endpoints
- 🎨 Redesigned UI with Bootstrap 5
- 📱 Enhanced mobile responsiveness

### Version 1.0.0
- 🎉 Initial release
- ⚡ Basic classroom finder
- 🗺️ Simple campus map
- 📡 REST API foundation

---

<div align="center">

**Built with ❤️ for NJIT Students**

[Website](http://localhost:3000) · [Documentation](docs/) · [Report Bug](issues/) · [Request Feature](issues/)

![NJIT](https://img.shields.io/badge/NJIT-Highlanders-red)
![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-green)
![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205-purple)

**Star ⭐ this repository if you find it helpful!**

</div>

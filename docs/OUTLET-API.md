# CampusSpace Outlet API Documentation

## Overview
The Outlet API provides endpoints for managing and tracking power outlet availability across campus buildings.

## Base URL
```
http://localhost:3000/api/outlets
```

## Endpoints

### 1. Get All Outlets
**GET** `/api/outlets`

Retrieve all outlets with optional filtering.

**Query Parameters:**
- `building` (optional) - Filter by building name
- `floor` (optional) - Filter by floor number
- `status` (optional) - Filter by status (available, occupied, out-of-service, unknown)

**Example:**
```bash
GET /api/outlets?building=KUPF&floor=2
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "outletId": "KUPF-2-207-1",
      "building": "KUPF",
      "floor": 2,
      "room": "KUPF 207",
      "type": "combination",
      "totalPorts": 4,
      "availablePorts": 2,
      "status": "available",
      "powerRating": {
        "voltage": 120,
        "amperage": 15
      },
      "location": {
        "type": "Point",
        "coordinates": [-74.177, 40.7425]
      },
      "notes": "Wall outlet near back row",
      "isVerified": true,
      "createdAt": "2025-12-21T00:00:00.000Z",
      "updatedAt": "2025-12-21T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Available Outlets
**GET** `/api/outlets/available`

Retrieve all currently available outlets (status = available and availablePorts > 0).

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### 3. Get Outlets by Location
**GET** `/api/outlets/location/:building/:floor`

Get all outlets in a specific building and floor.

**Example:**
```bash
GET /api/outlets/location/GITC/3
```

### 4. Get Single Outlet
**GET** `/api/outlets/:id`

Retrieve a specific outlet by MongoDB ID.

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

### 5. Create New Outlet
**POST** `/api/outlets`

Add a new outlet to the system.

**Request Body:**
```json
{
  "outletId": "KUPF-2-207-3",
  "building": "KUPF",
  "floor": 2,
  "room": "KUPF 207",
  "type": "usb-c",
  "totalPorts": 4,
  "availablePorts": 4,
  "status": "available",
  "powerRating": {
    "voltage": 120,
    "amperage": 15
  },
  "location": {
    "type": "Point",
    "coordinates": [-74.177, 40.7425]
  },
  "notes": "New charging station",
  "isVerified": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

### 6. Update Outlet
**PUT** `/api/outlets/:id`

Update outlet information.

**Request Body:** (partial update supported)
```json
{
  "availablePorts": 3,
  "status": "available"
}
```

### 7. Hardware Update
**POST** `/api/outlets/:id/hardware-update`

Update outlet status from IoT hardware sensor.

**Request Body:**
```json
{
  "availablePorts": 2
}
```

This automatically updates the status based on port availability.

### 8. Add User Report
**POST** `/api/outlets/:id/report`

Add a crowdsourced status report from a user.

**Request Body:**
```json
{
  "userId": "user123",
  "status": "available",
  "comment": "Outlet working fine"
}
```

The system uses majority voting from the last 3 reports to update the outlet status.

### 9. Delete Outlet
**DELETE** `/api/outlets/:id`

Remove an outlet from the system.

**Response:**
```json
{
  "success": true,
  "message": "Outlet deleted successfully"
}
```

### 10. Get Statistics
**GET** `/api/outlets/stats/summary`

Get outlet statistics and summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "available": 10,
    "occupied": 3,
    "outOfService": 2,
    "byBuilding": [
      {
        "_id": "KUPF",
        "count": 3,
        "available": 1
      },
      {
        "_id": "GITC",
        "count": 2,
        "available": 2
      }
    ]
  }
}
```

## Outlet Properties

### Outlet Types
- `standard` - Standard 2-prong outlets
- `usb` - USB-A charging ports
- `usb-c` - USB-C charging ports
- `combination` - Mix of standard and USB ports

### Status Values
- `available` - Outlet has available ports
- `occupied` - All ports in use
- `out-of-service` - Outlet not working
- `unknown` - Status not yet determined

## Database Schema

```javascript
{
  outletId: String (unique),
  building: String,
  floor: Number,
  room: String,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  type: String (enum),
  powerRating: {
    voltage: Number,
    amperage: Number
  },
  totalPorts: Number,
  availablePorts: Number,
  status: String (enum),
  hardwareId: String,
  lastHardwareUpdate: Date,
  isVerified: Boolean,
  reportedBy: String,
  verifiedBy: String,
  notes: String,
  usageCount: Number,
  lastUsed: Date,
  reports: [{
    userId: String,
    status: String,
    timestamp: Date,
    comment: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Testing the API

### Using curl:
```bash
# Get all outlets
curl http://localhost:3000/api/outlets

# Get available outlets
curl http://localhost:3000/api/outlets/available

# Create outlet
curl -X POST http://localhost:3000/api/outlets \
  -H "Content-Type: application/json" \
  -d '{"outletId":"TEST-1-101-1","building":"TEST","floor":1,"room":"TEST 101","type":"standard","totalPorts":2,"availablePorts":2,"status":"available"}'

# Add user report
curl -X POST http://localhost:3000/api/outlets/OUTLET_ID/report \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","status":"available","comment":"Working fine"}'
```

## Seeding Data

To populate the database with sample outlet data:

```bash
npm run seed-outlets
```

This will create 15 sample outlets across 8 buildings.

## Future Enhancements

1. **Real-time Updates** - WebSocket integration for live status updates
2. **Hardware Integration** - IoT sensors to automatically detect port usage
3. **User Favorites** - Allow users to favorite frequently used outlets
4. **Reservation System** - Reserve outlets for specific time periods
5. **Analytics Dashboard** - Usage patterns and statistics
6. **Mobile Notifications** - Alert users when outlets become available
7. **QR Code Scanning** - Scan outlet QR codes for quick reporting

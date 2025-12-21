const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
  // Outlet identification
  outletId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Location information
  building: {
    type: String,
    required: true,
    trim: true
  },
  
  floor: {
    type: Number,
    required: true
  },
  
  room: {
    type: String,
    required: true,
    trim: true
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  
  // Outlet properties
  type: {
    type: String,
    enum: ['standard', 'usb', 'usb-c', 'combination'],
    default: 'standard'
  },
  
  powerRating: {
    voltage: {
      type: Number,
      default: 120 // volts
    },
    amperage: {
      type: Number,
      default: 15 // amps
    }
  },
  
  totalPorts: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Availability tracking
  status: {
    type: String,
    enum: ['available', 'occupied', 'out-of-service', 'unknown'],
    default: 'unknown'
  },
  
  availablePorts: {
    type: Number,
    default: 0
  },
  
  // Hardware integration
  hardwareId: {
    type: String,
    trim: true,
    sparse: true // Allow multiple nulls
  },
  
  lastHardwareUpdate: {
    type: Date
  },
  
  // Metadata
  isVerified: {
    type: Boolean,
    default: false
  },
  
  reportedBy: {
    type: String,
    trim: true
  },
  
  verifiedBy: {
    type: String,
    trim: true
  },
  
  notes: {
    type: String,
    trim: true
  },
  
  // Usage statistics
  usageCount: {
    type: Number,
    default: 0
  },
  
  lastUsed: {
    type: Date
  },
  
  // Crowdsourced reports
  reports: [{
    userId: String,
    status: {
      type: String,
      enum: ['available', 'occupied', 'broken']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    comment: String
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for efficient queries
outletSchema.index({ building: 1, floor: 1 });
outletSchema.index({ status: 1 });
outletSchema.index({ location: '2dsphere' });
outletSchema.index({ hardwareId: 1 });

// Virtual for availability percentage
outletSchema.virtual('availabilityPercentage').get(function() {
  if (this.totalPorts === 0) return 0;
  return Math.round((this.availablePorts / this.totalPorts) * 100);
});

// Method to update status from hardware
outletSchema.methods.updateFromHardware = function(data) {
  this.availablePorts = data.availablePorts;
  this.status = data.availablePorts > 0 ? 'available' : 'occupied';
  this.lastHardwareUpdate = new Date();
  return this.save();
};

// Method to add crowdsourced report
outletSchema.methods.addReport = function(userId, status, comment) {
  this.reports.push({
    userId,
    status,
    comment,
    timestamp: new Date()
  });
  
  // Keep only last 10 reports
  if (this.reports.length > 10) {
    this.reports = this.reports.slice(-10);
  }
  
  // Update status based on recent reports (majority vote from last 3 reports)
  if (this.reports.length >= 3) {
    const recentReports = this.reports.slice(-3);
    const statusCount = {};
    recentReports.forEach(report => {
      statusCount[report.status] = (statusCount[report.status] || 0) + 1;
    });
    
    const mostReported = Object.keys(statusCount).reduce((a, b) => 
      statusCount[a] > statusCount[b] ? a : b
    );
    
    if (mostReported === 'broken') {
      this.status = 'out-of-service';
    } else if (mostReported === 'available') {
      this.status = 'available';
    } else if (mostReported === 'occupied') {
      this.status = 'occupied';
    }
  }
  
  return this.save();
};

// Static method to find outlets by building and floor
outletSchema.statics.findByLocation = function(building, floor) {
  return this.find({ building, floor }).sort({ room: 1 });
};

// Static method to find available outlets
outletSchema.statics.findAvailable = function() {
  return this.find({ 
    status: 'available',
    availablePorts: { $gt: 0 }
  }).sort({ availablePorts: -1 });
};

module.exports = mongoose.model('Outlet', outletSchema);

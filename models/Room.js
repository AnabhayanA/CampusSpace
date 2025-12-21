const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  // Room identification
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  building: {
    type: String,
    required: true,
    trim: true
  },
  
  floor: {
    type: Number,
    required: true
  },
  
  // Room properties
  name: {
    type: String,
    trim: true
  },
  
  capacity: {
    type: Number,
    min: 0
  },
  
  type: {
    type: String,
    enum: ['classroom', 'lab', 'lecture-hall', 'study-room', 'office', 'other'],
    default: 'classroom'
  },
  
  // Location
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
  
  // Schedule (from course data)
  schedule: [{
    courseCode: String,
    courseName: String,
    instructor: String,
    days: [String], // ['M', 'T', 'W', 'R', 'F']
    startTime: String,
    endTime: String,
    term: String
  }],
  
  // Features
  features: [{
    type: String,
    enum: ['projector', 'whiteboard', 'computers', 'outlets', 'wifi', 'ac', 'windows']
  }],
  
  // Outlet count
  outletCount: {
    type: Number,
    default: 0
  },
  
  // Current status
  currentStatus: {
    type: String,
    enum: ['available', 'occupied', 'scheduled', 'unknown'],
    default: 'unknown'
  },
  
  nextAvailable: {
    type: Date
  },
  
  // Metadata
  isVerified: {
    type: Boolean,
    default: false
  },
  
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
roomSchema.index({ building: 1, floor: 1 });
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ currentStatus: 1 });
roomSchema.index({ location: '2dsphere' });

// Method to check if room is available at a given time
roomSchema.methods.isAvailableAt = function(dateTime) {
  const dayMap = {0: 'Su', 1: 'M', 2: 'T', 3: 'W', 4: 'R', 5: 'F', 6: 'Sa'};
  const day = dayMap[dateTime.getDay()];
  const timeStr = dateTime.toTimeString().substring(0, 5); // HH:MM format
  
  for (const slot of this.schedule) {
    if (slot.days.includes(day)) {
      if (timeStr >= slot.startTime && timeStr < slot.endTime) {
        return false; // Room is occupied
      }
    }
  }
  
  return true; // Room is available
};

// Method to update schedule from course data
roomSchema.methods.updateSchedule = function(courses) {
  this.schedule = courses.map(course => ({
    courseCode: course.courseCode,
    courseName: course.courseName,
    instructor: course.instructor,
    days: course.days,
    startTime: course.startTime,
    endTime: course.endTime,
    term: course.term
  }));
  
  return this.save();
};

module.exports = mongoose.model('Room', roomSchema);

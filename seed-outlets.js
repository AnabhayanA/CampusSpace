const mongoose = require('mongoose');
const Outlet = require('./models/Outlet');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

// Sample outlet data for testing
const sampleOutlets = [
  // KUPF Building
  {
    outletId: 'KUPF-2-207-1',
    building: 'KUPF',
    floor: 2,
    room: 'KUPF 207',
    location: { type: 'Point', coordinates: [-74.177, 40.7425] },
    type: 'combination',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 4,
    availablePorts: 2,
    status: 'available',
    isVerified: true,
    notes: 'Wall outlet near back row'
  },
  {
    outletId: 'KUPF-2-207-2',
    building: 'KUPF',
    floor: 2,
    room: 'KUPF 207',
    location: { type: 'Point', coordinates: [-74.177, 40.7425] },
    type: 'standard',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 2,
    availablePorts: 0,
    status: 'occupied',
    isVerified: true,
    notes: 'Front wall outlet'
  },
  {
    outletId: 'KUPF-1-118-1',
    building: 'KUPF',
    floor: 1,
    room: 'KUPF 118',
    location: { type: 'Point', coordinates: [-74.177, 40.7425] },
    type: 'usb-c',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 6,
    availablePorts: 4,
    status: 'available',
    isVerified: true,
    notes: 'Charging station in back of classroom'
  },
  
  // FMH Building
  {
    outletId: 'FMH-3-302-1',
    building: 'FMH',
    floor: 3,
    room: 'FMH 302',
    location: { type: 'Point', coordinates: [-74.178, 40.7426] },
    type: 'standard',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 2,
    availablePorts: 2,
    status: 'available',
    isVerified: true,
    notes: 'Side wall outlet'
  },
  {
    outletId: 'FMH-4-407-1',
    building: 'FMH',
    floor: 4,
    room: 'FMH 407',
    location: { type: 'Point', coordinates: [-74.178, 40.7426] },
    type: 'combination',
    powerRating: { voltage: 120, amperage: 20 },
    totalPorts: 4,
    availablePorts: 1,
    status: 'available',
    isVerified: true,
    notes: 'Lab station outlet - high amperage'
  },
  
  // GITC Building
  {
    outletId: 'GITC-3-3710-1',
    building: 'GITC',
    floor: 3,
    room: 'GITC 3710',
    location: { type: 'Point', coordinates: [-74.1755, 40.7435] },
    type: 'usb',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 8,
    availablePorts: 6,
    status: 'available',
    isVerified: true,
    notes: 'Study room charging station'
  },
  {
    outletId: 'GITC-2-2406-1',
    building: 'GITC',
    floor: 2,
    room: 'GITC 2406',
    location: { type: 'Point', coordinates: [-74.1755, 40.7435] },
    type: 'standard',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 2,
    availablePorts: 2,
    status: 'available',
    isVerified: true,
    notes: 'Lecture hall side outlet'
  },
  
  // CAB Building
  {
    outletId: 'CAB-3-336-1',
    building: 'CAB',
    floor: 3,
    room: 'CAB 336',
    location: { type: 'Point', coordinates: [-74.1765, 40.7430] },
    type: 'combination',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 4,
    availablePorts: 0,
    status: 'occupied',
    isVerified: true,
    notes: 'Back wall outlet'
  },
  {
    outletId: 'CAB-2-218-1',
    building: 'CAB',
    floor: 2,
    room: 'CAB 218',
    location: { type: 'Point', coordinates: [-74.1765, 40.7430] },
    type: 'standard',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 2,
    availablePorts: 1,
    status: 'available',
    isVerified: false,
    notes: 'Need verification'
  },
  
  // CKB Building
  {
    outletId: 'CKB-1-120-1',
    building: 'CKB',
    floor: 1,
    room: 'CKB 120',
    location: { type: 'Point', coordinates: [-74.1745, 40.7440] },
    type: 'usb-c',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 6,
    availablePorts: 6,
    status: 'available',
    isVerified: true,
    notes: 'New charging station installed'
  },
  
  // Tiernan Hall
  {
    outletId: 'TIER-2-202-1',
    building: 'Tiernan',
    floor: 2,
    room: 'Tiernan 202',
    location: { type: 'Point', coordinates: [-74.1770, 40.7445] },
    type: 'standard',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 4,
    availablePorts: 3,
    status: 'available',
    isVerified: true,
    notes: 'Corner outlet'
  },
  {
    outletId: 'TIER-1-106-1',
    building: 'Tiernan',
    floor: 1,
    room: 'Tiernan 106',
    location: { type: 'Point', coordinates: [-74.1770, 40.7445] },
    type: 'combination',
    powerRating: { voltage: 120, amperage: 20 },
    totalPorts: 6,
    availablePorts: 0,
    status: 'occupied',
    isVerified: true,
    notes: 'Lab workbench outlets'
  },
  
  // Cullimore Hall
  {
    outletId: 'CULL-2-226-1',
    building: 'Cullimore',
    floor: 2,
    room: 'Cullimore 226',
    location: { type: 'Point', coordinates: [-74.1775, 40.7438] },
    type: 'usb',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 4,
    availablePorts: 2,
    status: 'available',
    isVerified: true,
    notes: 'Study table outlet'
  },
  
  // WEC Building
  {
    outletId: 'WEC-3-308-1',
    building: 'WEC',
    floor: 3,
    room: 'WEC 308',
    location: { type: 'Point', coordinates: [-74.1780, 40.7432] },
    type: 'standard',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 2,
    availablePorts: 1,
    status: 'available',
    isVerified: true,
    notes: 'Wall outlet near window'
  },
  {
    outletId: 'WEC-2-205-1',
    building: 'WEC',
    floor: 2,
    room: 'WEC 205',
    location: { type: 'Point', coordinates: [-74.1780, 40.7432] },
    type: 'combination',
    powerRating: { voltage: 120, amperage: 15 },
    totalPorts: 4,
    availablePorts: 4,
    status: 'available',
    isVerified: true,
    notes: 'Multiple outlets available'
  }
];

async function seedOutlets() {
  try {
    // Connect to database
    await connectDB();
    
    logger.info('[Seed] - Starting outlet data seeding');
    
    // Clear existing outlets
    await Outlet.deleteMany({});
    logger.info('[Seed] - Cleared existing outlet data');
    
    // Insert sample outlets
    const inserted = await Outlet.insertMany(sampleOutlets);
    logger.info('[Seed] - Inserted outlet data', {
      count: inserted.length
    });
    
    // Display summary
    const summary = {
      total: inserted.length,
      byBuilding: {},
      byStatus: {
        available: 0,
        occupied: 0,
        'out-of-service': 0
      }
    };
    
    inserted.forEach(outlet => {
      // Count by building
      if (!summary.byBuilding[outlet.building]) {
        summary.byBuilding[outlet.building] = 0;
      }
      summary.byBuilding[outlet.building]++;
      
      // Count by status
      summary.byStatus[outlet.status]++;
    });
    
    console.log('\n📊 Outlet Seeding Summary:');
    console.log('==========================');
    console.log(`Total Outlets: ${summary.total}`);
    console.log(`\nBy Status:`);
    console.log(`  ✅ Available: ${summary.byStatus.available}`);
    console.log(`  🔴 Occupied: ${summary.byStatus.occupied}`);
    console.log(`  ⚠️  Out of Service: ${summary.byStatus['out-of-service']}`);
    console.log(`\nBy Building:`);
    Object.keys(summary.byBuilding).sort().forEach(building => {
      console.log(`  ${building}: ${summary.byBuilding[building]}`);
    });
    
    logger.info('[Seed] - Seeding completed successfully', summary);
    
    process.exit(0);
  } catch (error) {
    logger.error('[Seed] - Error seeding data', {
      error: error.message,
      stack: error.stack
    });
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run seeding
seedOutlets();

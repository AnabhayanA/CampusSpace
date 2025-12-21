const express = require('express');
const router = express.Router();
const Outlet = require('../models/Outlet');
const logger = require('../utils/logger');

// GET all outlets
router.get('/', async (req, res) => {
  try {
    const { building, floor, status } = req.query;
    
    let query = {};
    if (building) query.building = building;
    if (floor) query.floor = parseInt(floor);
    if (status) query.status = status;
    
    const outlets = await Outlet.find(query).sort({ building: 1, floor: 1, room: 1 });
    
    logger.info('[Outlets] - Retrieved outlets', {
      count: outlets.length,
      filters: query
    });
    
    res.json({
      success: true,
      count: outlets.length,
      data: outlets
    });
  } catch (error) {
    logger.error('[Outlets] - Error retrieving outlets', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve outlets'
    });
  }
});

// GET available outlets
router.get('/available', async (req, res) => {
  try {
    const outlets = await Outlet.findAvailable();
    
    logger.info('[Outlets] - Retrieved available outlets', {
      count: outlets.length
    });
    
    res.json({
      success: true,
      count: outlets.length,
      data: outlets
    });
  } catch (error) {
    logger.error('[Outlets] - Error retrieving available outlets', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve available outlets'
    });
  }
});

// GET outlets by location
router.get('/location/:building/:floor', async (req, res) => {
  try {
    const { building, floor } = req.params;
    const outlets = await Outlet.findByLocation(building, parseInt(floor));
    
    logger.info('[Outlets] - Retrieved outlets by location', {
      building,
      floor,
      count: outlets.length
    });
    
    res.json({
      success: true,
      count: outlets.length,
      data: outlets
    });
  } catch (error) {
    logger.error('[Outlets] - Error retrieving outlets by location', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve outlets'
    });
  }
});

// GET single outlet by ID
router.get('/:id', async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found'
      });
    }
    
    res.json({
      success: true,
      data: outlet
    });
  } catch (error) {
    logger.error('[Outlets] - Error retrieving outlet', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve outlet'
    });
  }
});

// POST create new outlet
router.post('/', async (req, res) => {
  try {
    const outlet = await Outlet.create(req.body);
    
    logger.info('[Outlets] - Created new outlet', {
      outletId: outlet.outletId,
      building: outlet.building,
      room: outlet.room
    });
    
    res.status(201).json({
      success: true,
      data: outlet
    });
  } catch (error) {
    logger.error('[Outlets] - Error creating outlet', {
      error: error.message,
      data: req.body
    });
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT update outlet
router.put('/:id', async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!outlet) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found'
      });
    }
    
    logger.info('[Outlets] - Updated outlet', {
      outletId: outlet.outletId,
      updates: Object.keys(req.body)
    });
    
    res.json({
      success: true,
      data: outlet
    });
  } catch (error) {
    logger.error('[Outlets] - Error updating outlet', {
      error: error.message
    });
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST hardware update for outlet
router.post('/:id/hardware-update', async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found'
      });
    }
    
    await outlet.updateFromHardware(req.body);
    
    logger.info('[Outlets] - Hardware update received', {
      outletId: outlet.outletId,
      availablePorts: req.body.availablePorts,
      status: outlet.status
    });
    
    res.json({
      success: true,
      data: outlet
    });
  } catch (error) {
    logger.error('[Outlets] - Error processing hardware update', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to process hardware update'
    });
  }
});

// POST add crowdsourced report
router.post('/:id/report', async (req, res) => {
  try {
    const { userId, status, comment } = req.body;
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found'
      });
    }
    
    await outlet.addReport(userId, status, comment);
    
    logger.info('[Outlets] - User report added', {
      outletId: outlet.outletId,
      userId,
      reportedStatus: status
    });
    
    res.json({
      success: true,
      data: outlet
    });
  } catch (error) {
    logger.error('[Outlets] - Error adding report', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to add report'
    });
  }
});

// DELETE outlet
router.delete('/:id', async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found'
      });
    }
    
    logger.info('[Outlets] - Deleted outlet', {
      outletId: outlet.outletId
    });
    
    res.json({
      success: true,
      message: 'Outlet deleted successfully'
    });
  } catch (error) {
    logger.error('[Outlets] - Error deleting outlet', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete outlet'
    });
  }
});

// GET outlet statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Outlet.countDocuments();
    const available = await Outlet.countDocuments({ status: 'available' });
    const occupied = await Outlet.countDocuments({ status: 'occupied' });
    const outOfService = await Outlet.countDocuments({ status: 'out-of-service' });
    
    const byBuilding = await Outlet.aggregate([
      {
        $group: {
          _id: '$building',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    logger.info('[Outlets] - Retrieved statistics', {
      total,
      available
    });
    
    res.json({
      success: true,
      data: {
        total,
        available,
        occupied,
        outOfService,
        byBuilding
      }
    });
  } catch (error) {
    logger.error('[Outlets] - Error retrieving statistics', {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

module.exports = router;

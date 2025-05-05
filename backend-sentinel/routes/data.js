import express from 'express';
import dataController from '../controllers/dataController.js';
import validateSensorData from '../middlewares/validateSensorData.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

// POST /api/data
// Creates a new sensor data entry after validating the request body
router.post('/data', validateSensorData, dataController.createData);

// GET /api/data/latest
// Retrieves the latest timestamped data for each device
router.get('/data/latest', dataController.getLatestData);

// GET /api/data/:device_id
// Fetches historical sensor data for a specific device, optionally filtered by date range
router.get('/data/:device_id', dataController.getDeviceData);

// GET /api/alerts
// Returns sensor data entries that meet alert conditions (e.g. high CO2, loud noise, abnormal acceleration)
router.get('/alerts', dataController.getAlerts);

// GET /api/data/id/:id
// Get a specific data entry by ID
router.get('/data/id/:id', dataController.getById);

// PUT /api/data/id/:id
// Update a specific data entry by ID
router.put('/data/id/:id', dataController.updateById);

// DELETE /api/data/id/:id
// Delete a specific data entry by ID
router.delete('/data/id/:id', dataController.deleteById);

// GET /api/secure-info
// Example of a protected route using JWT authentication
router.get('/secure-info', authenticateToken, (req, res) => {
  res.json({
    message: `This is protected data for ${req.user.username}`,
    data: {
      sensorReading: 42,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;

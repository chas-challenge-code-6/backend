import express from 'express';
import dataController from '../controllers/dataController.js';
import validateSensorData from '../middlewares/validateSensorData.js';

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

export default router;

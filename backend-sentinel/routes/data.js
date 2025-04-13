import express from 'express';
import dataController from '../controllers/dataController.js';
import validateSensorData from '../middlewares/validateSensorData.js';

const router = express.Router();

router.post('/data', validateSensorData, dataController.createData);
router.get('/data/latest', dataController.getLatestData);
router.get('/data/:device_id', dataController.getDeviceData);
router.get('/alerts', dataController.getAlerts);

export default router;

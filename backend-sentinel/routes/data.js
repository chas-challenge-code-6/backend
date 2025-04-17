// routes/data.js
import express from 'express';
import dataController from '../controllers/dataController.js';
import validateSensorData from '../middlewares/validateSensorData.js';

const router = express.Router();

router.post('/', validateSensorData, dataController.createData);
router.get('/latest', dataController.getLatestData);
router.get('/alerts', dataController.getAlerts);
router.get('/:device_id', dataController.getDeviceData);

export default router;

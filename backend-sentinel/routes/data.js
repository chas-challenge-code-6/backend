import express from 'express';
import dataController from '../controllers/dataController.js';
import validateSensorData from '../middlewares/validateSensorData.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

//Get put and delete
router.get('/data/id/:id', dataController.getById);
router.put('/data/id/:id', dataController.updateById);
router.delete('/data/id/:id', dataController.deleteById);

router.post('/data', validateSensorData, dataController.createData);
router.get('/data/latest', dataController.getLatestData);
router.get('/data/:device_id', dataController.getDeviceData);
router.get('/alerts', dataController.getAlerts);
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

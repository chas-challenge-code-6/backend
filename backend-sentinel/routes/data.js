const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const validateSensorData = require('../middlewares/validateSensorData');

router.post('/data', validateSensorData, dataController.createData);
router.get('/data/latest', dataController.getLatestData);
router.get('/data/:device_id', dataController.getDeviceData);
router.get('/alerts', dataController.getAlerts);

module.exports = router;

import express from 'express';
import dataController from '../controllers/dataController.js';
import validateSensorData from '../middlewares/validateSensorData.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sensor Data
 *   description: Endpoints for submitting and retrieving sensor data
 */

/**
 * @swagger
 * /api/data:
 *   post:
 *     summary: Submit new sensor data
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_id
 *               - temperature
 *               - humidity
 *               - timestamp
 *             properties:
 *               device_id:
 *                 type: string
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Data created successfully
 *       400:
 *         description: Validation error or missing user ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/data',
  authenticateToken,
  validateSensorData,
  dataController.createData
);

/**
 * @swagger
 * /api/data/latest:
 *   get:
 *     summary: Get latest sensor data for all devices
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/data/latest', authenticateToken, dataController.getLatestData);

/**
 * @swagger
 * /api/data/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Verifies that the database connection is active
 *     tags: [Sensor Data]
 *     responses:
 *       200:
 *         description: Database connection successful
 *       500:
 *         description: Database connection failed
 */
router.get('/data/health', dataController.healthCheck);

/**
 * @swagger
 * /api/data/{device_id}:
 *   get:
 *     summary: Get sensor data for a specific device
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found or no data available
 *       500:
 *         description: Internal server error
 */
router.get('/data/:device_id', authenticateToken, dataController.getDeviceData);

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get active alerts
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alerts retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/alerts', authenticateToken, dataController.getAlerts);

export default router;

//stats.js
import express from 'express';
import statsController from '../controllers/statsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Application statistics and summaries
 */

/**
 * @swagger
 * /stats/summary:
 *   get:
 *     summary: Get statistical summary
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Returns statistical summary of the app data
 *       500:
 *         description: Internal server error
 */
router.get('/summary', statsController.getStatsSummary);

export default router;

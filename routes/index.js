import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root status check
 *     description: Returns a confirmation that the API is running
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: API is up and responding
 *       500:
 *         description: Internal server error
 */
router.get('/', (req, res) => {
  res.send('✅ API is running – Express on Render is working!');
});

export default router;

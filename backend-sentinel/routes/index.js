import express from 'express';
const router = express.Router();

// GET /
// Renders the home page with a simple title (used for testing or homepage display)
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

export default router;

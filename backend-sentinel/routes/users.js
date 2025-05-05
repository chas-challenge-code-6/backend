import express from 'express';
const router = express.Router();

// GET /users
// Returns a dummy user response (can be extended for user-related features)
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

export default router;

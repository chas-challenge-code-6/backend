import express from 'express';
import { loginUser, registerUser, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js'; // adjust path as needed

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });

export default router;

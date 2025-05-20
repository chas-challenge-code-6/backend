import express from 'express';
import {
  loginUser,
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

import { protect } from '../middlewares/authenticateToken.js';

const router = express.Router();

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// User profile
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;


import express from 'express';
import authController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();
router.get('/ping', (req, res) => {
  res.json({ alive: true });
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', authController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Internal server error
 */
router.post('/login', authController.loginUser);

/**
 * @swagger
 * /auth/devices/{deviceId}/token:
 *   post:
 *     summary: Get permanent JWT for a device
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the device (e.g. SENTINEL-001)
 *     responses:
 *       200:
 *         description: Permanent device token returned
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/devices/:deviceId/token',
  authenticateToken,
  authController.getDeviceToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout confirmed
 */
router.post('/logout', authenticateToken, authController.logoutUser);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 *       404:
 *         description: No user with that email
 *       500:
 *         description: Internal server error
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password has been reset
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticateToken, authController.getMe);

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               workplace:
 *                 type: string
 *               job_title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/me', authenticateToken, authController.updateMe);

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Delete current user's account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/me', authenticateToken, authController.deleteMe);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get('/users', authenticateToken, authController.getAllUsers);

export default router;

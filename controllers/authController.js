import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { sendResetEmail } from '../utils/mailer.js';

const { User, Device } = db;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET saknas! Avbryter start.');
  process.exit(1);
}

// 🔐 Generate user JWT (expires in 200h)
const generateToken = (user) =>
  jwt.sign({ id: user.id, username: user.username, type: 'user' }, JWT_SECRET, {
    expiresIn: '200h',
  });

// 🔐 Generate "permanent" device JWT (ingen expiresIn), inklusive userId
const generateDeviceToken = (device) =>
  jwt.sign(
    {
      device_id: device.device_id,
      userId: device.userId,
      type: 'device',
    },
    JWT_SECRET
  );

// POST /auth/register
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ status: 'error', message: 'All fields are required' });
  }
  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res
        .status(400)
        .json({ status: 'error', message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    res
      .status(201)
      .json({
        status: 'success',
        message: 'User registered successfully',
        data: { id: user.id, username: user.username },
      });
  } catch (err) {
    console.error('❌ Error in registerUser:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({
      status: 'success',
      message: 'Login successful',
      data: { token, user: { id: user.id, username: user.username } },
    });
  } catch (err) {
    console.error('❌ Error in loginUser:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /auth/devices/:deviceId/token
const getDeviceToken = async (req, res) => {
  const { deviceId } = req.params;
  try {
    // Förutsatt att devices är kopplade till en userId
    let device = await Device.findOne({ where: { device_id: deviceId } });
    if (!device) {
      // Skapa device-post med req.user.id som ägare
      device = await Device.create({
        device_id: deviceId,
        userId: req.user.id,
      });
    }
    const token = generateDeviceToken(device);
    res.json({ status: 'success', token });
  } catch (err) {
    console.error('❌ Error in getDeviceToken:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Övriga routes exporteras unverändrade
export default {
  registerUser,
  loginUser,
  logoutUser: (req, res) =>
    res.json({ status: 'success', message: 'Logged out successfully' }),
  getMe: async (req, res) => {
    /* ... */
  },
  updateMe: async (req, res) => {
    /* ... */
  },
  deleteMe: async (req, res) => {
    /* ... */
  },
  forgotPassword: async (req, res) => {
    /* ... */
  },
  resetPassword: async (req, res) => {
    /* ... */
  },
  getAllUsers: async (req, res) => {
    /* ... */
  },
  getDeviceToken,
};

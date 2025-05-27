import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { sendResetEmail } from '../utils/mailer.js';

const { User, Device } = db;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET missing! Aborting startup.');
  process.exit(1);
}

// 🔐 Generate user JWT (expires in 200h)
const generateToken = (user) =>
  jwt.sign({ id: user.id, username: user.username, type: 'user' }, JWT_SECRET, {
    expiresIn: '200h',
  });

// 🔐 Generate "permanent" device JWT (no expiresIn)
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

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('❌ Error in registerUser:', err);
    // Handle Sequelize validation errors explicitly
    if (err.name === 'SequelizeValidationError' && Array.isArray(err.errors)) {
      const errors = err.errors.map((e) => e.message);
      return res.status(400).json({ status: 'error', errors });
    }
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

// GET /auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: user });
  } catch (err) {
    console.error('❌ Error in getMe:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /auth/me
const updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    const { email, password, phone_number, workplace, job_title } = req.body;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (workplace) user.workplace = workplace;
    if (job_title) user.job_title = job_title;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (err) {
    console.error('❌ Error in updateMe:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /auth/me
const deleteMe = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.user.id } });
    if (!deleted) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error in deleteMe:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No user with that email' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || '200h',
    });
    await sendResetEmail(user.email, token);
    res.json({ status: 'success', message: 'Password reset email sent' });
  } catch (err) {
    console.error('❌ Error in forgotPassword:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/reset-password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ status: 'success', message: 'Password has been reset' });
  } catch (err) {
    console.error('❌ Error in resetPassword:', err);
    res
      .status(400)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// POST /auth/logout
const logoutUser = (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
};

// GET /auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('❌ Error in getAllUsers:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/devices/:deviceId/token
const getDeviceToken = async (req, res) => {
  const { deviceId } = req.params; // e.g. "SENTINEL-001"
  try {
    let device = await Device.findOne({ where: { device_id: deviceId } });
    if (!device) {
      device = await Device.create({ device_id: deviceId });
    }
    const token = generateDeviceToken(device);
    res.json({ status: 'success', token });
  } catch (err) {
    console.error('❌ Error in getDeviceToken:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getDeviceToken,
};

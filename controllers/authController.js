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
const registerUser = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    const err = new Error('All fields are required');
    err.status = 400;
    return next(err);
  }

  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      const err = new Error('User already exists');
      err.status = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('❌ Full error in registerUser:', err);
    err.status = 400;
    return next(err);
  }
};

// POST /auth/login
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  console.log('Login attempt - username:', username);
  if (!username || !password) {
    const err = new Error('Username and password are required');
    err.status = 400;
    return next(err);
  }

  try {
    const user = await User.findOne({ where: { username } });
    console.log(
      'User fetched from DB:',
      user
        ? { id: user.id, username: user.username, password: user.password }
        : null
    );
    if (!user) {
      const err = new Error('Invalid credentials - user not found');
      err.status = 400;
      return next(err);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      const err = new Error('Invalid credentials - wrong password');
      err.status = 400;
      return next(err);
    }

    const token = generateToken(user);
    res.json({
      status: 'success',
      message: 'Login successful',
      data: { token, user: { id: user.id, username: user.username } },
    });
  } catch (err) {
    console.error('❌ Error in loginUser:', err);
    err.status = 500;
    return next(err);
  }
};

// GET /auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json({ status: 'success', data: user });
  } catch (err) {
    console.error('❌ Error in getMe:', err);
    err.status = 500;
    return next(err);
  }
};

// PATCH /auth/me
const updateMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
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
    err.status = 500;
    return next(err);
  }
};

// DELETE /auth/me
const deleteMe = async (req, res, next) => {
  try {
    const deleted = await User.destroy({ where: { id: req.user.id } });
    if (!deleted) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error in deleteMe:', err);
    err.status = 500;
    return next(err);
  }
};

// POST /auth/forgot-password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const err = new Error('No user with that email');
      err.status = 404;
      return next(err);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || '200h',
    });
    await sendResetEmail(user.email, token);
    res.json({ status: 'success', message: 'Password reset email sent' });
  } catch (err) {
    console.error('❌ Error in forgotPassword:', err);
    err.status = 500;
    return next(err);
  }
};

// POST /auth/reset-password
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ status: 'success', message: 'Password has been reset' });
  } catch (err) {
    console.error('❌ Error in resetPassword:', err);
    err.status = 400;
    err.message = 'Invalid or expired token';
    return next(err);
  }
};

// POST /auth/logout
const logoutUser = (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
};

// GET /auth/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('❌ Error in getAllUsers:', err);
    err.status = 500;
    return next(err);
  }
};

// POST /auth/devices/:deviceId/token
const getDeviceToken = async (req, res, next) => {
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
    err.status = 500;
    return next(err);
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

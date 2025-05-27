import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { sendResetEmail } from '../utils/mailer.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 🔐 Generate JWT token
const generateToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '200h',
  });

const registerUser = async (req, res) => {
  console.log('📥 Register request received:', req.body);

  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    console.log('❌ Missing fields');
    return res
      .status(400)
      .json({ status: 'error', message: 'All fields are required' });
  }

  try {
    console.log('🔍 Checking for existing user...');
    const userExists = await User.findOne({ where: { username } });
    console.log('🧾 User exists?', !!userExists);

    if (userExists) {
      return res
        .status(400)
        .json({ status: 'error', message: 'User already exists' });
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');

    console.log('📦 Creating user...');
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    console.log('✅ User created:', user.id);

    res.status(201).json({
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
      data: {
        token,
        user: { id: user.id, username: user.username },
      },
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

    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });

    res.json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /auth/me
const updateMe = async (req, res) => {
  const userId = req.user.id;
  const { email, password, phone_number, workplace, job_title } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });

    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (workplace) user.workplace = workplace;
    if (job_title) user.job_title = job_title;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /auth/me
const deleteMe = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.user.id } });

    if (!deleted)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });

    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'No user with that email' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || '200h',
    });

    await sendResetEmail(user.email, token);
    res.json({ status: 'success', message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/reset-password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ status: 'success', message: 'Password has been reset' });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// POST /auth/logout
const logoutUser = async (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
};

// GET /auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('❌ Error in getAllUsers:', err);
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
};

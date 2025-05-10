import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// POST /auth/register
// ⤷ Registers a new user if the username is not taken
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: { username }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

// POST /auth/login
// ⤷ Logs in an existing user and returns a JWT token
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      status: 'success',
      token
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

// GET /me
// ⤷ Returns the currently authenticated user's username
export const getMe = (req, res) => {
  const { username } = req.user;

  res.json({
    status: 'success',
    user: { username }
  });
};

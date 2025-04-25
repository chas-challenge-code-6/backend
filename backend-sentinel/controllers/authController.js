import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const users = []; // Temp in-memory store

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find((u) => u.username === username);
  if (userExists)
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
};

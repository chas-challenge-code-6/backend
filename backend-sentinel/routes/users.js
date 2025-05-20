import express from 'express';
const router = express.Router();
const mongoose = require('mongoose');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

export default router;
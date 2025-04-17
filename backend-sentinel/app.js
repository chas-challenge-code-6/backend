// app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Routes
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import dataRoutes from './routes/data.js';
import statsRoutes from './routes/stats.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/data', dataRoutes); // Now clearly separated
app.use('/api/stats', statsRoutes); // ✅ Now also under /api

// Optional: 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;

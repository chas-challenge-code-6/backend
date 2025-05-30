// app.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { swaggerUi, specs } from './utils/swagger.js';

import indexRouter from './routes/index.js';
import dataRoutes from './routes/data.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ─── M I D D L E W A R E ─────────────────────────────────────────────────────
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ─── R O U T E   M O U N T S ──────────────────────────────────────────────────
app.use('/', indexRouter);
app.use('/api', dataRoutes);
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

export default app;

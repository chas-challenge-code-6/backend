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
import { errorHandler } from './middlewares/errorHandler.js';

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

// ─── S W A G G E R ────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ─── R A W   S W A G G E R   J S O N ──────────────────────────────────────────
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// ─── 404 H A N D L I N G ──────────────────────────────────────────────────────
app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  next(err);
});

// ─── C E N T R A L   E R R O R   H A N D L E R ─────────────────────────────────
app.use(errorHandler);

export default app;

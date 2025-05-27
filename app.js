// app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import dataRoutes from './routes/data.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/index.js';
import { swaggerUi, specs } from './utils/swagger.js'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Sync database
(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database synced with Sequelize');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
})();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/api', dataRoutes);
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);

// ✅ Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Fallback route for 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

export default app;

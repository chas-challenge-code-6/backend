import { SensorData } from '../models/index.js';
import { Op } from 'sequelize';

// POST /api/data
const createData = async (req, res, next) => {
  try {
    const { device_id, sensors, timestamp, userId: bodyUserId } = req.body;
    const userId = req.user?.id ?? req.user?.device_id ?? bodyUserId;

    if (!userId) {
      console.error(
        'Missing userId; req.user:',
        req.user,
        'bodyUserId:',
        bodyUserId
      );
      const err = new Error('Missing userId for INSERT');
      err.status = 400;
      return next(err);
    }

    const createdAt = timestamp ? new Date(timestamp) : new Date();
    console.log(`Inserting data for userId=${userId}, device_id=${device_id}`);

    const data = await SensorData.create({
      userId,
      device_id,
      temperature: sensors.temperature,
      humidity: sensors.humidity,
      gas: sensors.gas?.ppm,
      fall_detected: sensors.fall_detected,
      heart_rate: sensors.heart_rate,
      noise_level: sensors.noise_level,
      steps: sensors.steps,
      device_battery: sensors.device_battery,
      strap_battery: sensors.strap_battery,
      createdAt,
    });

    res
      .status(201)
      .json({ status: 'success', message: 'Data saved successfully', data });
  } catch (err) {
    console.error('Error in createData:', err);
    err.status = 500;
    next(err);
  }
};

// GET /api/data/latest
const getLatestData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [results] = await SensorData.sequelize.query(
      `
      SELECT sd.*
      FROM "SensorData" sd
      INNER JOIN (
        SELECT device_id, MAX("createdAt") AS latest
        FROM "SensorData"
        WHERE "userId" = :userId
        GROUP BY device_id
      ) AS latest_data
      ON sd.device_id = latest_data.device_id
      AND sd."createdAt" = latest_data.latest
      WHERE sd."userId" = :userId
      `,
      { replacements: { userId }, type: SensorData.sequelize.QueryTypes.SELECT }
    );
    res.json(results);
  } catch (err) {
    console.error('Error in getLatestData:', err);
    err.status = 500;
    next(err);
  }
};

// GET /api/data/:device_id
const getDeviceData = async (req, res, next) => {
  try {
    const { device_id } = req.params;
    const userId = req.user.id;
    let { start, end } = req.query;

    if (!start || !end) {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      start = start || yesterday.toISOString();
      end = end || now.toISOString();
    }

    const data = await SensorData.findAll({
      where: { userId, device_id, createdAt: { [Op.between]: [start, end] } },
      order: [['createdAt', 'DESC']],
    });

    res.json(data);
  } catch (err) {
    console.error('Error in getDeviceData:', err);
    err.status = 500;
    next(err);
  }
};

// GET /api/alerts
const getAlerts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await SensorData.findAll({
      where: {
        userId,
        [Op.or]: [
          { gas: { [Op.gt]: 1000 } },
          { noise_level: { [Op.gt]: 100 } },
          { fall_detected: true },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    const alerts = data.map((entry) => {
      if (entry.gas > 1000)
        return {
          device_id: entry.device_id,
          type: 'gas',
          value: entry.gas,
          message: 'High gas level detected',
          timestamp: entry.createdAt,
        };
      if (entry.noise_level > 100)
        return {
          device_id: entry.device_id,
          type: 'noise',
          value: entry.noise_level,
          message: 'High noise level detected',
          timestamp: entry.createdAt,
        };
      if (entry.fall_detected)
        return {
          device_id: entry.device_id,
          type: 'fall',
          value: null,
          message: 'Fall detected',
          timestamp: entry.createdAt,
        };
      return null;
    });

    res.json(alerts.filter(Boolean));
  } catch (err) {
    console.error('Error in getAlerts:', err);
    err.status = 500;
    next(err);
  }
};

// Health check endpoint
const healthCheck = async (req, res, next) => {
  try {
    await SensorData.sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('HealthCheck failed:', err);
    err.status = 500;
    next(err);
  }
};

export default {
  createData,
  getLatestData,
  getDeviceData,
  getAlerts,
  healthCheck,
};

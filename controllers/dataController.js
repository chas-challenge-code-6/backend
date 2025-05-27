import { SensorData } from '../models/index.js';
import { Op } from 'sequelize';

// POST /api/data
const createData = async (req, res) => {
  try {
    const { device_id, sensors, timestamp, userId: bodyUserId } = req.body;
    // Use user ID from token, or from request body, or fallback to device_id
    const userId = req.user?.id ?? bodyUserId ?? device_id;

    const createdAt = timestamp ? new Date(timestamp) : new Date();

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
      watch_battery: sensors.watch_battery,
      createdAt,
    });

    res.status(201).json({
      status: 'success',
      message: 'Data saved successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/latest
const getLatestData = async (req, res) => {
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
      {
        replacements: { userId },
        type: SensorData.sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/:device_id
const getDeviceData = async (req, res) => {
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
      where: {
        userId,
        device_id,
        createdAt: { [Op.between]: [start, end] },
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/alerts
const getAlerts = async (req, res) => {
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
      if (entry.gas > 1000) {
        return {
          device_id: entry.device_id,
          type: 'gas',
          value: entry.gas,
          message: 'High gas level detected',
          timestamp: entry.createdAt,
        };
      }
      if (entry.noise_level > 100) {
        return {
          device_id: entry.device_id,
          type: 'noise',
          value: entry.noise_level,
          message: 'High noise level detected',
          timestamp: entry.createdAt,
        };
      }
      if (entry.fall_detected) {
        return {
          device_id: entry.device_id,
          type: 'fall',
          value: null,
          message: 'Fall detected',
          timestamp: entry.createdAt,
        };
      }
      return null;
    });

    res.json(alerts.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  createData,
  getLatestData,
  getDeviceData,
  getAlerts,
};

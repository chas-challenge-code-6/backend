import { SensorData } from '../models/index.js';
import { Op } from 'sequelize';

// POST /api/data
// ⤷ Accepts sensor data from an IoT device and stores it in the database
const createData = async (req, res) => {
  try {
    const { device_id, timestamp, sensors } = req.body;

    // ⤷ Create a new entry in SensorData using the provided fields
    const data = await SensorData.create({
      device_id,
      timestamp,
      temperature: sensors.temperature,              // Temperature in Celsius
      humidity: sensors.humidity,                    // Humidity in %
      gas: sensors.gas?.ppm,                         // Gas level in ppm (from `gas: { ppm: ... }`)
      fall_detected: sensors.fall_detected,          // Boolean indicating fall detection
      heart_rate: sensors.heart_rate,                // Heart rate in BPM
      noise_level: sensors.noise_level,              // Sound level in dB
      steps: sensors.steps,                          // Step count (pedometer)
      device_battery: sensors.device_battery,        // Battery % of the device
      watch_battery: sensors.watch_battery           // Battery % of the connected watch, if any
    });

    // ⤷ Respond in the expected format as per the API documentation
    res.status(201).json({
      status: 'success',
      message: 'Data saved successfully'
    });

  } catch (err) {
    // ⤷ If saving fails, return an internal server error
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/latest
// ⤷ Returns the latest sensor reading for each device
const getLatestData = async (req, res) => {
  try {
    // ⤷ Raw SQL query to get the full latest row for each device_id
    const [results] = await SensorData.sequelize.query(`
      SELECT sd.*
      FROM SensorData sd
      INNER JOIN (
        SELECT device_id, MAX(timestamp) AS latest
        FROM SensorData
        GROUP BY device_id
      ) AS latest_data
      ON sd.device_id = latest_data.device_id
      AND sd.timestamp = latest_data.latest
    `);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/:device_id
// ⤷ Returns historical data for a specific device within a time range
const getDeviceData = async (req, res) => {
  const { device_id } = req.params;
  let { from, to } = req.query;

  try {
    // ⤷ If no range is provided, default to the past 24 hours
    if (!from || !to) {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      from = from || yesterday.toISOString();
      to = to || now.toISOString();
    }

    const data = await SensorData.findAll({
      where: {
        device_id,
        timestamp: {
          [Op.between]: [from, to]
        }
      },
      order: [['timestamp', 'DESC']]
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/alerts
// ⤷ Returns critical alerts where gas, noise, or fall detection thresholds are exceeded
const getAlerts = async (req, res) => {
  try {
    const data = await SensorData.findAll({
      where: {
        [Op.or]: [
          { gas: { [Op.gt]: 1000 } },            // Gas threshold
          { noise_level: { [Op.gt]: 100 } },     // Noise threshold
          { fall_detected: true }                // Fall detected
        ]
      },
      order: [['timestamp', 'DESC']]
    });

    // ⤷ Format each alert as expected by the API
    const alerts = data.map(entry => {
      if (entry.gas > 1000) {
        return {
          device_id: entry.device_id,
          type: 'gas',
          value: entry.gas,
          message: 'High gas level detected',
          timestamp: entry.timestamp
        };
      } else if (entry.noise_level > 100) {
        return {
          device_id: entry.device_id,
          type: 'noise',
          value: entry.noise_level,
          message: 'High noise level detected',
          timestamp: entry.timestamp
        };
      } else if (entry.fall_detected) {
        return {
          device_id: entry.device_id,
          type: 'fall',
          value: null,
          message: 'Fall detected',
          timestamp: entry.timestamp
        };
      }
    });

    // ⤷ Filter out undefined (in case none of the conditions match)
    res.json(alerts.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  createData,
  getLatestData,
  getDeviceData,
  getAlerts
};

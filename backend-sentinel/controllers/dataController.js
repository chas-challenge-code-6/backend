const { SensorData } = require('../models');
const { Op } = require('sequelize');

// POST /api/data
exports.createData = async (req, res) => {
  try {
    const { device_id, timestamp, sensors } = req.body;
    const data = await SensorData.create({
      device_id,
      timestamp,
      temperature: sensors.temperature,
      humidity: sensors.humidity,
      co2: sensors.gas.co2,
      co: sensors.gas.co,
      acceleration_x: sensors.acceleration.x,
      acceleration_y: sensors.acceleration.y,
      acceleration_z: sensors.acceleration.z,
      heart_rate: sensors.heart_rate,
      noise_level: sensors.noise_level,
      battery: sensors.battery
    });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/latest
exports.getLatestData = async (req, res) => {
  try {
    const latest = await SensorData.findAll({
      attributes: ['device_id', [Sequelize.fn('MAX', Sequelize.col('timestamp')), 'latest_time']],
      group: ['device_id']
    });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/data/:device_id
exports.getDeviceData = async (req, res) => {
  const { device_id } = req.params;
  const { start, end } = req.query;

  try {
    const data = await SensorData.findAll({
      where: {
        device_id,
        timestamp: {
          [Op.between]: [start, end]
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
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await SensorData.findAll({
      where: {
        [Op.or]: [
          { co2: { [Op.gt]: 1000 } },
          { co: { [Op.gt]: 50 } },
          { noise_level: { [Op.gt]: 100 } },
          { acceleration_z: { [Op.lt]: 3.0 } } // fall detection
        ]
      },
      order: [['timestamp', 'DESC']]
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

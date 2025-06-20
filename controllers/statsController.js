import { SensorData } from '../models/index.js';
import { fn, col } from 'sequelize';

const getStatsSummary = async (req, res, next) => {
  try {
    // Total number of entries
    const totalEntries = await SensorData.count();

    // Number of distinct devices
    const deviceCount = await SensorData.count({
      distinct: true,
      col: 'device_id',
    });

    // Average sensor values (only numerical, meaningful fields)
    const averages = await SensorData.findAll({
      attributes: [
        [fn('AVG', col('temperature')), 'avg_temperature'],
        [fn('AVG', col('humidity')), 'avg_humidity'],
        [fn('AVG', col('gas')), 'avg_gas'],
        [fn('AVG', col('heart_rate')), 'avg_heart_rate'],
        [fn('AVG', col('noise_level')), 'avg_noise_level'],
        [fn('AVG', col('device_battery')), 'avg_device_battery'],
        [fn('AVG', col('strap_battery')), 'avg_strap_battery'],
        [fn('AVG', col('steps')), 'avg_steps'],
      ],
    });

    res.json({
      totalEntries,
      deviceCount,
      averages: averages[0].dataValues, // Sequelize returns array, take the first result object
    });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export default {
  getStatsSummary,
};

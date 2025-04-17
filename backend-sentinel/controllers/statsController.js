// controllers/statsController.js
import { SensorData } from '../models/index.js';
import { fn, col } from 'sequelize';

const getStatsSummary = async (req, res) => {
  try {
    // Hämta sammanfattande statistik för alla sensorer
    const summary = await SensorData.findAll({
      attributes: [
        [fn('AVG', col('temperature')), 'avg_temperature'],
        [fn('AVG', col('humidity')), 'avg_humidity'],
        [fn('AVG', col('co2')), 'avg_co2'],
        [fn('MAX', col('temperature')), 'max_temperature'],
        [fn('MIN', col('temperature')), 'min_temperature'],
        [fn('MAX', col('humidity')), 'max_humidity'],
        [fn('MIN', col('humidity')), 'min_humidity'],
        [fn('MAX', col('co2')), 'max_co2'],
        [fn('MIN', col('co2')), 'min_co2'],
        [fn('MAX', col('noise_level')), 'max_noise_level'],
        [fn('MIN', col('noise_level')), 'min_noise_level'],
        [fn('AVG', col('acceleration_x')), 'avg_acceleration_x'],
        [fn('AVG', col('acceleration_y')), 'avg_acceleration_y'],
        [fn('AVG', col('acceleration_z')), 'avg_acceleration_z'],
        [fn('MAX', col('acceleration_x')), 'max_acceleration_x'],
        [fn('MIN', col('acceleration_x')), 'min_acceleration_x'],
      ],
    });

    // Skicka sammanfattningen som svar
    res.json(summary[0]); // Eftersom vi bara vill ha en sammanfattning skickar vi det första objektet från arrayen
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getStatsSummary,
};

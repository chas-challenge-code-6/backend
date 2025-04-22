import validateSensorData from '../middlewares/validateSensorData.js';

export default (sequelize, DataTypes) => {
  const SensorData = sequelize.define('SensorData', {
    device_id: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    temperature: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    co2: DataTypes.FLOAT,
    co: DataTypes.FLOAT,
    acceleration_x: DataTypes.FLOAT,
    acceleration_y: DataTypes.FLOAT,
    acceleration_z: DataTypes.FLOAT,
    heart_rate: DataTypes.FLOAT,
    noise_level: DataTypes.FLOAT,
    battery: DataTypes.FLOAT,
  });

  return SensorData;
};

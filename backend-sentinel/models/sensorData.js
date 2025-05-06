import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Import Sequelize instance

const SensorData = sequelize.define(
  'SensorData',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temperature: DataTypes.FLOAT,
    humidity: DataTypes.INTEGER,
    co2: DataTypes.INTEGER,
    co: DataTypes.INTEGER,
    acceleration_x: DataTypes.FLOAT,
    acceleration_y: DataTypes.FLOAT,
    acceleration_z: DataTypes.FLOAT,
    heart_rate: DataTypes.INTEGER,
    noise_level: DataTypes.INTEGER,
    battery: DataTypes.INTEGER,
  },
  {
    tableName: 'sensor_data',
    timestamps: false,
  }
);

export { SensorData };

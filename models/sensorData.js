export default (sequelize, DataTypes) => {
  const SensorData = sequelize.define('SensorData', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    temperature: DataTypes.FLOAT,
    humidity: DataTypes.INTEGER,
    gas: DataTypes.INTEGER,
    fall_detected: DataTypes.BOOLEAN,
    heart_rate: DataTypes.INTEGER,
    noise_level: DataTypes.INTEGER,
    steps: DataTypes.INTEGER,
    device_battery: DataTypes.INTEGER,
    watch_battery: DataTypes.INTEGER,
    
    // 🧩 Foreign key till User
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true  
  });

  // 🧩 Association: varje sensorData tillhör en användare
  SensorData.associate = (models) => {
    SensorData.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return SensorData;
};

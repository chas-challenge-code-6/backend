// models/device.js
export default (sequelize, DataTypes) => {
  const Device = sequelize.define(
    'Device',
    {
      device_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Assumes your users table is named "Users"
          key: 'id',
        },
      },
      // additional fields can be added here
    },
    {
      tableName: 'Devices',
      timestamps: true, // Enable createdAt/updatedAt
    }
  );

  // Association: a Device belongs to a User, and may have many SensorData entries
  Device.associate = (models) => {
    Device.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
    });
    if (models.SensorData) {
      Device.hasMany(models.SensorData, {
        foreignKey: 'device_id',
        sourceKey: 'device_id',
      });
    }
  };

  return Device;
};

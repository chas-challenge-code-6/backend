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
        //allowNull: false,
        allowNull: true, // temporarily allow NULL so the ALTER can succeed
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      // …
    },
    {
      tableName: 'Devices',
      timestamps: false,
    }
  );

  // … associations …
  return Device;
};

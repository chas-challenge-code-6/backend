// models/device.js
export default (sequelize, DataTypes) => {
  const Device = sequelize.define(
    'Device',
    {
      device_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      // här kan du lägga till fler fält om du vill
    },
    {
      tableName: 'Devices',
      timestamps: false, // sätt till true om du vill spara createdAt/updatedAt
    }
  );

  return Device;
};

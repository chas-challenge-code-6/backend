export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    workplace: {
      type: DataTypes.STRING,
      allowNull: true
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return User;
};

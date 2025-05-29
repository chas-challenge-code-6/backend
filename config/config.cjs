// config/config.cjs
require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './dev.sqlite',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  },
};

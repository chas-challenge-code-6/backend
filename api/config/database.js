// config/database.js
import { Sequelize } from 'sequelize';

// Laddar miljövariabler från .env om du använder det
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_database',
  process.env.DB_USER || 'your_user',
  process.env.DB_PASSWORD || 'your_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false, // sätt till true om du vill se SQL-loggar
  }
);

export default sequelize;

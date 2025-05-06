import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sensor_data_db', // The name of your database
  username: process.env.DB_USER || 'your_pg_user', // PostgreSQL username
  password: process.env.DB_PASSWORD || 'your_pg_password', // PostgreSQL password
  logging: false, // Set to true to log SQL queries
});

// Test the connection (optional, but helpful for debugging)
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;

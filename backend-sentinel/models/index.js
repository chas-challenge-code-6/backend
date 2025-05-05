import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { SensorData } from './sensorData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Read the config file manually
const configJson = JSON.parse(
  fs.readFileSync(new URL('../config/config.json', import.meta.url), 'utf-8')
);
const config = configJson[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const loadModels = async () => {
  const db = {};

  const modelFiles = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
    );

  for (const file of modelFiles) {
    const { default: modelDef } = await import(`./${file}`);
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  // Setup associations if they exist
  for (const modelName of Object.keys(db)) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  }

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};

export { loadModels, sequelize, SensorData };

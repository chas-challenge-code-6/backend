import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from '../config/database.js'; // 👈 använd rätt config
import { SensorData } from './sensorData.js'; // 👈 direktimport av modell

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);

const db = {
  SensorData,
  sequelize,
  Sequelize,
};

// Valfritt: Dynamiskt ladda fler modeller i mappen
const modelFiles = fs.readdirSync(__dirname).filter(
  (file) =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1 &&
    file !== 'sensorData.js' // eftersom vi redan importerat den
);

for (const file of modelFiles) {
  const modelModule = await import(`./${file}`);
  const modelDef = modelModule.default;
  if (modelDef) {
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

// Associations
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

export default db;

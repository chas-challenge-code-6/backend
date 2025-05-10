import db from './models/index.js';

const syncDatabase = async () => {
  try {
    await db.sequelize.sync({ alter: true }); // använd { force: true } om du vill nollställa tabeller
    console.log('✅ Databasen är synkroniserad!');
    process.exit();
  } catch (err) {
    console.error('❌ Fel vid databas-synk:', err);
    process.exit(1);
  }
};

syncDatabase();

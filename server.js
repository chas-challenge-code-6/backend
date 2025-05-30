// server.js
import 'dotenv/config';
import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced with Sequelize (created missing tables)');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT} on all interfaces`);
    });
  })
  .catch(err => {
    console.error('❌ Error syncing database:', err);
  });

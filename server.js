// server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js'; // ← this must point to your app.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

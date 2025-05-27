// server.js (or app.js entry point)
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Bind to 0.0.0.0 so localhost and 127.0.0.1 are both accepted
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} on all interfaces`);
});

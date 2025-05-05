import app from '../app.js';
import http from 'http';
import debugLib from 'debug';
import dotenv from 'dotenv';

dotenv.config();

// Skapa en debug-instans
const debug = debugLib('backend-sentinel:server');

// Sätt port
const PORT = normalizePort(process.env.PORT || '8765');
app.set('port', PORT);

// Skapa HTTP-server
const server = http.createServer(app);

// Starta server
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

// === Hjälpfunktioner ===

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} kräver administratörsrättigheter`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} används redan`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
}

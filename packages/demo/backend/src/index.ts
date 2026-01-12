import app from './route';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { seedDatabase } from './db';
import { WebSocketManager } from './websocket';

dotenv.config({
  path: path.join(__dirname, '..', '.env'),
  debug: true,
  override: true,
});

process.env['CALLBACK_OBJECTS'] = JSON.stringify({ excel: 'Map' });

seedDatabase().catch((error) => {
  if (error?.message?.includes('UNIQUE constraint failed')) {
    return;
  }
  console.error('Error seeding database:', error);
});

const port = Number(process.env['SERVER_PORT']) || 4000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`WebSocket running on ws://localhost:${port}`);
});

const wsManager = new WebSocketManager(server);

const filePath = path.join(__dirname, '../../frontend/.env.development');
const envList = [
  `VITE_BACKEND_URL=http://localhost:${port}`,
  'VITE_DEFAULT_EXCEL_ID=',
  `VITE_WEBSOCKET_URL=ws://localhost:${port}`,
];

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, envList.join('\n'));
}

process.on('SIGINT', () => {
  console.log('Shutting down server...');

  wsManager.closeAllConnections();

  server.close(() => {
    console.log('HTTP server closed');

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    process.exit(0);
  });
});

process.on('exit', () => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

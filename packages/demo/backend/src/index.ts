import './config';
import app from './route';
import fs from 'node:fs';
import path from 'node:path';
import { seedDatabase, closeDatabase } from './db';
import { WebSocketManager } from './websocket';
import { DocumentPersistence } from './persistence';

async function start() {
  await seedDatabase();
  const persistence = new DocumentPersistence();
  persistence.install();
  const port = Number(process.env['SERVER_PORT']) || 4000;
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`WebSocket running on ws://localhost:${port}`);
  });
  const wsManager = new WebSocketManager(server, (doc) => persistence.release(doc));
  const filePath = path.join(__dirname, '../../frontend/.env.development');
  const createdEnvFile = !fs.existsSync(filePath);
  if (createdEnvFile) {
    fs.writeFileSync(filePath, [
      `VITE_BACKEND_URL=http://localhost:${port}`,
      'VITE_DEFAULT_EXCEL_ID=',
      `VITE_WEBSOCKET_URL=ws://localhost:${port}`,
    ].join('\n'));
  }
  const cleanup = () => {
    if (createdEnvFile && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  };
  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log('Shutting down server...');
    (async () => {
      await wsManager.closeAllConnections();
      await persistence.flushAll();
      await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
      await closeDatabase();
      cleanup();
    })().catch((error: unknown) => {
      console.error('Failed to shut down collaboration server', error);
      process.exitCode = 1;
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', cleanup);
}

start().catch((error: unknown) => {
  console.error('Failed to start collaboration server', error);
  process.exitCode = 1;
});

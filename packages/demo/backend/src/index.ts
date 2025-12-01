import app from './route';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

process.env['CALLBACK_URL'] = 'http://localhost:4000/sync';
process.env['CALLBACK_OBJECTS'] = JSON.stringify({ excel: 'Map' });

import { setupWSConnection } from '@y/websocket-server/utils';
import { seedDatabase } from './db'


// Initialize on import
seedDatabase().catch(error => {
  if (error?.message?.includes('UNIQUE constraint failed')) {
    return
  }
  console.error('Error seeding database:', error);
});

const port = 4000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`WebSocket running on ws://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, request) => {
  const docId = request.url?.slice(1) ?? '';
  console.log(`websocket doc id: ${docId}`);
  setupWSConnection(ws, request, { gc: true, docName: docId });
});

const filePath = path.join(__dirname, '../../frontend/.env.development');

const envList = [
  `VITE_BACKEND_URL=http://localhost:${port}`,
  'VITE_DEFAULT_EXCEL_ID=',
  `VITE_WEBSOCKET_URL=ws://localhost:${port}`,
];

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, envList.join('\n'));
}

process.on('exit', () => {
  fs.unlinkSync(filePath);
});

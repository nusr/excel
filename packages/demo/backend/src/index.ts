import app from './route';
import fs from 'fs';
import path from 'path';

const port = 4000;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

const filePath = path.join(__dirname, '../../frontend/.env.development');

const envList = [
  `VITE_BACKEND_URL=http://localhost:${port}`,
  'VITE_DEFAULT_EXCEL_ID=',
  'VITE_WEBSOCKET_URL=ws://localhost:1234',
];

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, envList.join('\n'));
}

process.on('exit', () => {
  fs.unlinkSync(filePath);
});

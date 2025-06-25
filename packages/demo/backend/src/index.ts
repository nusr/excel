import app from './route';
import fs from 'fs';
import path from 'path';

const port = 4000;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

const filePath = path.join(__dirname, '../../frontend/.env.development');
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(
    filePath,
    `VITE_BACKEND_URL=http://localhost:4000\nVITE_DEFAULT_EXCEL_ID=`,
  );
}
process.on('exit', () => {
  fs.unlinkSync(filePath);
});

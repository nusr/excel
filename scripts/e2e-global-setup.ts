import { exec } from 'child_process';
import fs from 'fs';

export default async function (
  _globalConfig: any,
  projectConfig: any,
): Promise<void> {
  const result = await exec('npm run start');
  result.stdout?.on('data', function (event) {
    const prefix = 'running in: http://localhost:';
    if (event.startsWith(prefix)) {
      const port = event.slice(prefix.length).trim();
      const filePath = projectConfig.globals.__portFilePath;
      fs.writeFileSync(filePath, String(port), 'utf-8');
    }
  });
}

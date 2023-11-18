import { exec } from 'child_process';

export default async function (): Promise<void> {
  const result = await exec('npm run start');
  result.stdout?.on('data', function (event) {
    const prefix = 'running in: http://localhost:';
    if (event.startsWith(prefix)) {
      const port = parseInt(event.slice(prefix.length).trim(), 10);
      console.log(port);
    }
  });
}

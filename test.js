const { exec } = require('child_process');

async function init() {
  const result = await exec('npm run start');
  result.stdout.on('data', function (event) {
    const prefix = 'running in: http://localhost:';
    if (event.startsWith(prefix)) {
      const t = event.slice(prefix.length).trim();
      console.log(t);
    }
  });
}
init();

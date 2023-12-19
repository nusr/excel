// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildSync } = require('esbuild');

function init() {
  const dir = path.join(process.cwd(), 'scripts');

  fs.readdir(dir, (error, list) => {
    if (error) {
      console.log(error);
      return;
    }
    for (const item of list) {
      const ext = path.extname(item);
      const filePath = path.join(dir, item);
      if (ext === '.ts') {
        const temp = filePath.replace('.ts', '.js');
        buildSync({
          entryPoints: [filePath],
          outfile: temp,
          format: 'cjs',
          // target: 'es2020',
        });
      } else if (ext === '.js') {
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  });
}

init();

const fs = require('fs').promises;
const path = require('path');

/**
 *
 * @param {string} rootDir
 * @param {string} outputPath
 */
async function mergeCoverageFiles(rootDir, outputPath) {
  /**
   * @type {string[]}
   */
  const coverageFiles = [];
  const mergedData = {};

  /**
   * @param {string} dir
   */
  async function traverseDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name === 'node_modules') continue;

        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await traverseDirectory(entryPath);
        } else if (entry.isFile() && entry.name === 'coverage-final.json') {
          coverageFiles.push(entryPath);
        }
      }
    } catch (err) {
      console.error(`Error accessing directory ${dir}:`, err);
    }
  }

  await traverseDirectory(rootDir);

  for (const filePath of coverageFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(content);

    Object.assign(mergedData, jsonData);
  }

  await fs.writeFile(outputPath, JSON.stringify(mergedData, null, 2));
}

mergeCoverageFiles(
  path.join(__dirname, '../packages'),
  path.join(__dirname, '../coverage-final.json'),
).catch((err) => {
  console.error(err);
});

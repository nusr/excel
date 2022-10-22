/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
function deleteDirectory(deleteDir = 'dist') {
  const deletePath = path.join(process.cwd(), deleteDir);
  fs.rm(deletePath, { recursive: true }, (error) => {});
}
deleteDirectory();
deleteDirectory('yarn.lock');
module.exports = {
  deleteDirectory,
};

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
function deleteDirectory(deleteDir = "dist") {
  const deletePath = path.join(process.cwd(), deleteDir);
  if (!fs.existsSync(deletePath)) {
    console.log(`directory: ${deletePath} no exist!`);
    return;
  }
  fs.rmdirSync(deletePath, { recursive: true });
}
deleteDirectory();
module.exports = {
  deleteDirectory,
};

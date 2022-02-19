/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
function deleteDirectory(deleteDir = "dist") {
  const deletePath = path.join(process.cwd(), deleteDir);
  if (!fs.existsSync(deletePath)) {
    return;
  }
  fs.rmdirSync(deletePath, { recursive: true });
}
deleteDirectory();
deleteDirectory("yarn.lock");
module.exports = {
  deleteDirectory,
};

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const rimraf = require("rimraf");
function init() {
  const deleteList = ["dist", "package-lock.json", "node_modules"];
  deleteList.forEach((item) => {
    const deleteDir = path.join(process.cwd(), item);
    rimraf.sync(deleteDir);
  });
}
init();

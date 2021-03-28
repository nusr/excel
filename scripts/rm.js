/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
function init() {
  const deleteDir = process.argv[2] || "dist";
  fs.rmdirSync(path.join(process.cwd(), deleteDir), { recursive: true });
}
init();

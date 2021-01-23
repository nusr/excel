/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const pkg = require("../package.json");
const cwd = process.cwd();
const list = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
];
for (const item of list) {
  const pkgPath = path.join(cwd, "node_modules", item, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log(pkgPath);
    continue;
  }
  const data = require(pkgPath);
  const list = data && data.dependencies && Object.keys(data.dependencies);
  if (list && list.length > 0) {
    console.log(`package ${item} :`);
    console.log(list);
  }
}

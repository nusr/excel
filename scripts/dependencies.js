/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const nodeModules = path.join(process.cwd(), "node_modules");
const pkg = require("../package.json");
const fileName = path.join(process.cwd(), "dependencies.json");
const lastDependencies = require(fileName);

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);
    } else {
      filesList.push(fullPath);
    }
  });
  return filesList;
}
function init() {
  const list = readFileList(nodeModules).filter((item) =>
    item.endsWith("package.json")
  );
  const result = {};
  const dependencyList = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
    "@babel",
    "@types",
  ];
  for (let item of list) {
    const { dependencies, name } = require(item);
    const check =
      dependencies &&
      Object.keys(dependencies).length > 0 &&
      dependencyList.every((v) => !name.includes(v));
    if (check) {
      result[name] = dependencies;
      if (!lastDependencies[name]) {
        console.log(`${name} dependencies: ${JSON.stringify(dependencies)}`);
      }
    }
  }
  fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
}

init();

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const esBuild = require("esbuild");
const { getEnv } = require("./env");
require("../scripts/rm.js");
const cwd = process.cwd();
console.log("cwd:", cwd);
const distDir = path.join(cwd, "dist");
const assetsDir = path.join(cwd, "assets");
const { NODE_ENV } = getEnv();
const isProd = NODE_ENV === "production";
const { staticService, openBrowser, buildLog } = require("./server");
console.log("NODE_ENV:", NODE_ENV);
const { handleSVGFiles } = require("./svg");

const entryPath = path.join(cwd, "src/index.tsx");
const tsconfigPath = path.join(cwd, "tsconfig.json");
const commonConfig = {
  entryPoints: [entryPath],
  chunkNames: "chunks/[name]-[hash]",
  splitting: true,
  format: "esm",
  bundle: true,
  minify: isProd,
  sourcemap: true,
  tsconfig: tsconfigPath,
  outdir: distDir,
  define: {
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  },
};

function fileWatch(watchDir, callback) {
  if (process.platform === "linux") {
    if (fs.statSync(watchDir).isDirectory()) {
      fs.watch(watchDir, callback);
      fs.readdirSync(watchDir).forEach((filePath) =>
        fileWatch(`${watchDir}/${filePath}`, callback)
      );
    }
  } else {
    fs.watch(watchDir, { recursive: true }, callback);
  }
}
function copyHtml() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  const htmlPath = "index.html";
  const files = fs.readdirSync(assetsDir);
  for (const item of files) {
    if (item === htmlPath) {
      continue;
    }
    const sourceFile = path.join(assetsDir, item);
    const targetFile = path.join(distDir, item);
    fs.copyFileSync(sourceFile, targetFile);
  }
  const encoding = "utf8";
  const htmlStr = fs.readFileSync(path.join(assetsDir, htmlPath), encoding);
  const distFiles = fs.readdirSync(distDir);
  const indexJs = distFiles.filter((v) => /^index.[m]?js$/.test(v))[0];
  const result = htmlStr.replace(
    `<!--INDEX_JS_ENTRY-->`,
    `<script ${
      commonConfig.format === "esm" ? ' type="module" ' : ""
    } src="${indexJs}"></script>`
  );
  fs.writeFileSync(path.join(distDir, htmlPath), result, encoding);
}

let isBuild = false;

function buildJs(type = "", fileName = "") {
  if (isBuild) {
    return;
  }
  const errorFilePath = path.join(distDir, "buildError.txt");
  isBuild = true;
  buildLog(`${typeof fileName === "string" ? fileName : ""}: ${type}`);
  esBuild
    .build({
      ...commonConfig,
    })
    .then(() => {
      copyHtml();
      handleSVGFiles();
      if (!isProd) {
        fs.writeFileSync(errorFilePath, "");
      }
    })
    .catch((error) => {
      console.log(error);
      if (!isProd) {
        fs.writeFileSync(errorFilePath, `${error.message}\n${error.stack}`);
      } else {
        process.exit(1);
      }
    })
    .finally(() => {
      isBuild = false;
    });
}

function init() {
  buildJs();
  if (!isProd) {
    const watchList = ["src", "icons", "assets"];
    for (const item of watchList) {
      fileWatch(path.join(cwd, item), buildJs);
    }
    const url = staticService();
    openBrowser(url);
  }
}

init();

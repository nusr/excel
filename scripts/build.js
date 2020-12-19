/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const esBuild = require("esbuild");
const rimraf = require("rimraf");
const distDir = path.join(__dirname, "..", "dist");
const NODE_ENV = process.env.NODE_ENV || "production";
const isProd = NODE_ENV === "production";

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
  const sourceFile = path.join(__dirname, "..", "assets/index.html");
  const targetFile = path.join(__dirname, "..", "dist/index.html");
  fs.copyFileSync(sourceFile, targetFile);
}

function buildJs(type = "", fileName = "") {
  try {
    console.log(`${typeof fileName === "string" ? fileName : ""}: ${type}`);
    const commonConfig = {
      entryPoints: ["./src/index.tsx"],
      bundle: true,
      minify: isProd,
      sourcemap: true,
      tsconfig: "./tsconfig.json",
      outdir: "dist",
      define: {
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      },
    };
    esBuild.buildSync({
      ...commonConfig,
    });
    copyHtml();
  } catch (error) {
    console.error(error);
  }
}

function init() {
  rimraf.sync(distDir);
  buildJs();
  if (!isProd) {
    require("./server.js");
    const watchDir = path.join(__dirname, "..", "src");
    fileWatch(watchDir, buildJs);
  }
}

init();

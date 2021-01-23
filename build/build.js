/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const esBuild = require("esbuild");
const cwd = process.cwd();
const distDir = path.join(cwd, "dist");
const assetsDir = path.join(cwd, "assets");
const NODE_ENV = (process.env.NODE_ENV || "production").trim();
console.log("NODE_ENV", NODE_ENV);
const isProd = NODE_ENV === "production";
const { staticService, openBrowser } = require("./server");
const { handleSVGFiles } = require("./svg");

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
  const sourceFile = path.join(assetsDir, "index.html");
  const targetFile = path.join(distDir, "index.html");
  fs.copyFileSync(sourceFile, targetFile);
}

function buildJs(type = "", fileName = "") {
  const errorFilePath = path.join(distDir, "buildError.txt");
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
    handleSVGFiles();
    fs.writeFileSync(errorFilePath, "");

    const temp = require("../dist");
    console.log(temp);
  } catch (error) {
    console.log("buildJs error", error);
    fs.writeFileSync(errorFilePath, `${error.message}\n${error.stack}`);
  }
}

function init() {
  buildJs();
  if (!isProd) {
    const watchList = ["src", "icons"];
    for (const item of watchList) {
      fileWatch(path.join(cwd, item), buildJs);
    }
    const url = staticService();
    openBrowser(url);
  }
}

init();

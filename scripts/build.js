/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const esBuild = require("esbuild");
const cwd = process.cwd();
const distDir = path.join(cwd, "dist");
const NODE_ENV = process.env.NODE_ENV || "production";
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
  const sourceFile = path.join(cwd, "assets/index.html");
  const targetFile = path.join(cwd, "dist/index.html");
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
    esBuild
      .build({
        ...commonConfig,
      })
      .then(copyHtml)
      .then(handleSVGFiles);
  } catch (error) {
    console.error(error);
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

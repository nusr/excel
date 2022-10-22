/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const esBuild = require("esbuild");
const { getEnv } = require("./env");
const { deleteDirectory } = require("../scripts/rm");
const { handleSVGFiles } = require("./svg");
const cwd = process.cwd();
const distDir = path.join(cwd, "dist");
const assetsDir = path.join(cwd, "assets");
const { NODE_ENV } = getEnv();
const isProd = NODE_ENV === "production";
const entryPath = path.join(cwd, "src/index.tsx");
const tsconfigPath = path.join(cwd, "tsconfig.json");
const FORMAT = "iife";

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
      FORMAT === "esm" ? ' type="module" ' : ""
    } src="${indexJs}"></script>`
  );
  fs.writeFileSync(path.join(distDir, htmlPath), result, encoding);
}

let isBuilding = false;

function buildJs() {
  if (isBuilding) {
    return;
  }
  isBuilding = true;
  const errorFilePath = path.join(distDir, "buildError.txt");
  const params = {
    entryPoints: [entryPath],
    chunkNames: "chunks/[name]-[hash]",
    // splitting: true,
    format: FORMAT,
    bundle: true,
    minify: isProd,
    sourcemap: true,
    tsconfig: tsconfigPath,
    outdir: distDir,
    define: {
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
    },
  };
  esBuild
    .build({
      ...params,
      watch: isProd
        ? null
        : {
            onRebuild(error) {
              if (error) console.error("watch build failed:", error);
              else console.log(`watch build succeeded:${new Date().getTime()}`);
              buildJs();
            },
          },
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
      isBuilding = false;
    });
}

function init() {
  deleteDirectory();
  buildJs();
}

init();

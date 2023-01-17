import { build, BuildOptions, context } from "esbuild";
import packageJson from "../package.json";
import * as fs from "fs";
import * as path from "path";
import childProcess from "child_process";

const envConfig = getEnv();
const productionMode = "production";
const nodeEnv = envConfig["NODE_ENV"] || productionMode;
const isDev = nodeEnv === "development";
const globalName = "__export__";
const licenseText = fs.readFileSync(
  path.join(process.cwd(), "LICENSE"),
  "utf-8"
);
const distDir = path.join(process.cwd(), "dist");

console.log("distDir--->:", distDir);

function openBrowser(url: string) {
  let cmd: string = "";
  const args: string[] = [];
  if (process.platform === "darwin") {
    try {
      childProcess.execSync(
        `osascript openChrome.applescript "${encodeURI(url)}"`,
        {
          cwd: __dirname,
          stdio: "ignore",
        }
      );
      return true;
    } catch (error) {
      console.log(error);
    }
    cmd = "open";
  } else if (process.platform === "win32") {
    cmd = "cmd.exe";
    args.push("/c", "start", '""', "/b");
    url = url.replace(/&/g, "^&");
  } else {
    cmd = "xdg-open";
  }
  args.push(url);
  childProcess.spawn(cmd, args);
}

function getEnv(): Record<string, string> {
  const result: Record<string, string> = {};
  const rest = process.argv.slice(2);
  return rest.reduce((prev, current = "") => {
    const [key = "", value = ""] = current.trim().split("=");
    const t = key.trim();
    if (t) {
      prev[t] = value.trim();
    }
    return prev;
  }, result);
}

function umdWrapper() {
  const header = `(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
              (global = global || self, factory(global.${packageJson.name} = {}));
       })(this, (function (exports) { 'use strict';`;

  const footer = `
    for(var key in ${globalName}) {
            exports[key] = ${globalName}[key]
        }
    }));`;

  return { header, footer };
}

/**
 * build esm
 */
function buildESM(filePath: string): BuildOptions {
  return buildBrowserConfig({
    outfile: filePath,
    format: "esm",
  });
}

/**
 * build umd
 */
function buildUMD(filePath: string): BuildOptions {
  const umd = umdWrapper();
  return buildBrowserConfig({
    outfile: filePath,
    format: "iife",
    globalName,
    banner: {
      js: `/* \n${licenseText} \n*/${umd.header}`,
    },
    footer: {
      js: umd.footer,
    },
  });
}

function buildBrowserConfig(options: BuildOptions): BuildOptions {
  const minify = !!options.outfile?.includes(".min.");
  const realOptions: BuildOptions = {
    bundle: true,
    entryPoints: ["src/index.ts"],
    tsconfig: "tsconfig.json",
    define: {
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
      "process.env.VERSION": JSON.stringify(packageJson.version),
    },
    banner: {
      js: `/* \n${licenseText}\n*/`,
    },
    platform: "browser",
    sourcemap: true,
    minify,
    metafile: minify,
  };
  Object.assign(realOptions, options);

  return realOptions;
}

function buildHtml() {
  const data = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
  fs.writeFileSync(
    path.join(distDir, "index.html"),
    data.replace("process.env.NODE_ENV", JSON.stringify(nodeEnv))
  );
}

function deleteDir(dir: string) {
  fs.rm(path.join(process.cwd(), dir), { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

async function main() {
  deleteDir("lib");
  deleteDir("dist");
  const options = buildUMD("");
  const list = await Promise.all(
    [
      {
        ...options,
        outdir: distDir,
      },
      buildESM(packageJson.module),
      buildUMD(packageJson.main),
      buildESM(packageJson.module.replace(".js", ".min.js")),
      buildUMD(packageJson.main.replace(".js", ".min.js")),
    ].map(async (item) => {
      const result = await build(item);
      return result;
    })
  );
  buildHtml();
  return list;
}

async function liveReload() {
  deleteDir("dist");
  const options = buildUMD("");
  const ctx = await context({
    ...options,
    outfile: undefined,
    outdir: distDir,
  });

  await ctx.watch();

  const { port } = await ctx.serve({
    servedir: distDir,
  });
  buildHtml();
  const url = `http://localhost:${port}`;
  openBrowser(url);
  console.log(`running in: ${url}`);
}

function init() {
  if (isDev) {
    liveReload();
  } else {
    main();
  }
}
init();

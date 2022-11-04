import { build, BuildOptions, BuildResult, analyzeMetafile } from 'esbuild';
import packageJson from '../package.json';
import * as fs from 'fs';
import * as path from 'path';
import assert from 'assert';

const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig['NODE_ENV'] || productionMode;
const isDev = nodeEnv === 'development';
const globalName = '__export__';
const licenseText = fs.readFileSync(
  path.join(process.cwd(), 'LICENSE'),
  'utf-8',
);
const distDir = path.join(process.cwd(), 'dist');

function getEnv(): Record<string, string> {
  const result: Record<string, string> = {};
  const rest = process.argv.slice(2);
  return rest.reduce((prev, current = '') => {
    const [key = '', value = ''] = current.trim().split('=');
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
 * @param { string } filePath
 */
function buildESM(filePath: string) {
  return buildBrowserConfig({
    outfile: filePath,
    format: 'esm',
  });
}

/**
 * build umd
 */
function buildUMD(filePath: string) {
  const umd = umdWrapper();
  return buildBrowserConfig({
    outfile: filePath,
    format: 'iife',
    globalName,
    banner: {
      js: `/* \n${licenseText} \n*/${umd.header}`,
    },
    footer: {
      js: umd.footer,
    },
  });
}

async function buildBrowserConfig(options: BuildOptions): Promise<BuildResult> {
  const minify = !!options.outfile?.includes('.min.');
  const realOptions: BuildOptions = {
    bundle: true,
    watch: isDev,
    entryPoints: ['src/index.tsx'],
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.VERSION': JSON.stringify(packageJson.version),
    },
    banner: {
      js: `/* \n${licenseText}\n*/`,
    },
    platform: 'browser',
    sourcemap: isDev,
    minify: false,
    metafile: minify,
  };
  Object.assign(realOptions, options);
  const result = await build(realOptions);
  if (result.metafile) {
    const text = await analyzeMetafile(result.metafile, { verbose: true });
    console.log(text);
  }
  return result;
}

function buildHtml() {
  fs.copyFileSync(
    path.join(__dirname, 'index.html'),
    path.join(distDir, 'index.html'),
  );
}

function deleteDir(dir: string) {
  fs.rm(path.join(process.cwd(), dir), { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

function formatFileName(svgName: string) {
  const list = svgName.toLowerCase().split('-');
  return list
    .map((item, i) => {
      if (i === 0) {
        return item;
      }
      return item[0].toUpperCase() + item.slice(1);
    })
    .join('');
}

function parseSVGFile(text: string, fileName: string) {
  assert(text.length > 0, 'svg file can not be empty');
  const start = text.indexOf('<path');
  const end = text.indexOf('</svg>');
  const result = text.slice(start, end);
  assert(text.length > 0, `${fileName} path is empty`);
  return `
    <symbol
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1024 1024"
      id="icon-${fileName}"
      version="1.1"
    >
      ${result}
    </symbol>`;
}

async function buildIcon() {
  const SVG_SYMBOL_TAG = '__SVG_SYMBOL_NODE__';
  const dir = path.join(process.cwd(), 'icons');
  const files = fs.readdirSync(dir);
  const svgList: string[] = [];
  const fileNameList: string[] = [];
  for (const item of files) {
    const [temp] = item.split('.');
    const filePath = path.join(dir, item);
    const text = await fs.promises.readFile(filePath, 'utf-8');
    const fileName = formatFileName(temp);
    svgList.push(parseSVGFile(text, fileName));
    fileNameList.push(fileName);
  }
  const nameList = fileNameList.map((item) => `"${item}"`).join(' | ');
  const data = `export type BaseIconName = ${nameList}`;
  const iconType = path.join(process.cwd(), 'src/types/icons.ts');
  fs.writeFile(iconType, data, 'utf-8', (error) => {
    if (error) {
      console.log('write icon type fail', error);
    }
  });

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="position: absolute; width: 0; height: 0"
      id="${SVG_SYMBOL_TAG}"
    >
      ${svgList.join('\n\t\t\t\t')}
    </svg>`;
  const htmlPath = path.join(distDir, 'index.html');
  const htmlStr = await fs.promises.readFile(htmlPath, 'utf-8');
  const result = htmlStr.replace(`<!--${SVG_SYMBOL_TAG}-->`, svg);
  await fs.promises.writeFile(htmlPath, result, 'utf-8');
}

async function main() {
  const startPath = path.join(distDir, 'excel.umd.js');
  if (isDev) {
    return buildUMD(startPath);
  }
  deleteDir('lib');
  deleteDir('dist');
  const list = await Promise.all([
    buildUMD(startPath),
    buildESM(packageJson.module),
    buildUMD(packageJson.main),
    buildESM(packageJson.module.replace('.js', '.min.js')),
    buildUMD(packageJson.main.replace('.js', '.min.js')),
  ]);
  buildHtml();
  await buildIcon();
  return list;
}

main().then(() => {
  console.log('finished');
});

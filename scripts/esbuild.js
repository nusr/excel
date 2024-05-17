const { build, context } = require('esbuild');
const packageJson = require('../package.json');
const path = require('path');
const fs = require('fs');
const { parseArgs } = require('util');
const { networkInterfaces } = require('os');

const { values: envConfig } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
    // production development test
    nodeEnv: {
      type: 'string',
      short: 'e',
    },
  },
  allowPositionals: true,
});

const nodeEnv = envConfig.nodeEnv || 'development';
const isDev = nodeEnv === 'development';

const licenseText = fs.readFileSync(
  path.join(process.cwd(), 'LICENSE'),
  'utf-8',
);
const globalName = '__export__';
const distDir = path.join(process.cwd(), 'dist');
const workPath = './src/worker.ts';

function umdWrapper() {
  const header = `(function (global, factory) { typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = global || self, factory(global.${packageJson.name} = {}));})(this, (function (exports) { 'use strict';`;
  const footer = `for(var key in ${globalName}) { exports[key] = ${globalName}[key] } }));`;
  return { header, footer };
}

/**
 * build ESM
 * @param {string} filePath
 * @returns {import('esbuild').BuildOptions}
 */
function buildESM(filePath) {
  return buildBrowserConfig({
    outfile: filePath,
    format: 'esm',
  });
}

/**
 * build UMD
 * @param {string} filePath
 * @returns {import('esbuild').BuildOptions}
 */
function buildUMD(filePath) {
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

/**
 *
 * @param { import('esbuild').BuildOptions } options
 * @returns {import('esbuild').BuildOptions}
 */
function buildBrowserConfig(options) {
  const minify = !!options.outfile?.includes('.min.');
  /** @type Record<string, string> */
  const externalMap = {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    'react-dom/client': 'window.ReactDOM',
  };
  const namespace = 'external';
  /** @type {import('esbuild').BuildOptions} */
  const realOptions = {
    bundle: true,
    entryPoints: ['src/index.ts'],
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.VERSION': JSON.stringify(packageJson.version),
    },
    banner: {
      js: `/* \n${licenseText}\n*/`,
    },
    platform: 'browser',
    sourcemap: true,
    minify,
    metafile: minify,
    logLevel: 'error',
    plugins: [
      {
        name: namespace,
        setup(build) {
          build.onResolve(
            {
              filter: new RegExp(
                '^(' + Object.keys(externalMap).join('|') + ')$',
              ),
            },
            (args) => ({
              path: args.path,
              namespace: namespace,
            }),
          );

          build.onLoad(
            {
              filter: /.*/,
              namespace,
            },
            (args) => {
              const contents = `module.exports = ${externalMap[args.path]}`;
              return {
                contents,
              };
            },
          );
        },
      },
    ],
  };
  Object.assign(realOptions, options);
  return realOptions;
}

function buildHtml() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  fs.writeFileSync(
    path.join(distDir, 'index.html'),
    data.replace('process.env.NODE_ENV', JSON.stringify(nodeEnv)),
  );

  const version = isDev ? 'development' : 'production.min';
  fs.copyFileSync(
    path.join(__dirname, '..', `node_modules/react/umd/react.${version}.js`),
    path.join(distDir, 'react.js'),
  );
  fs.copyFileSync(
    path.join(
      __dirname,
      '..',
      `node_modules/react-dom/umd/react-dom.${version}.js`,
    ),
    path.join(distDir, 'react-dom.js'),
  );

  const iconDir = path.join(__dirname, './icon');
  const resultDir = path.join(distDir, 'icon');
  const files = fs.readdirSync(iconDir);
  if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir);
  }
  for (const item of files) {
    const source = path.join(iconDir, item);
    const dest = path.join(resultDir, item);
    fs.copyFileSync(source, dest);
  }
}

/**
 * delete directory
 * @param {string} dir
 */
function deleteDir(dir) {
  const t = path.join(process.cwd(), dir);
  if (fs.existsSync(t)) {
    fs.rmSync(t, { recursive: true, force: true });
  }
}

/**
 *
 * @param { import('esbuild').BuildOptions } options
 */
async function buildProd(options) {
  const workerOptions = buildUMD('./lib/worker.js');
  const workerMinifyOptions = buildUMD('./lib/worker.min.js');
  workerMinifyOptions.entryPoints = workerOptions.entryPoints = [workPath];
  const list = await Promise.all(
    [
      options,
      workerOptions,
      workerMinifyOptions,
      buildESM(packageJson.module),
      buildUMD(packageJson.main),
      buildESM(packageJson.module.replace('.js', '.min.js')),
      buildUMD(packageJson.main.replace('.js', '.min.js')),
    ].map(async (item) => {
      const result = await build(item);
      return result;
    }),
  );
  return list;
}

function getIp() {
  const localIPs = networkInterfaces();
  for (const key of Object.keys(localIPs)) {
    if (!localIPs || !localIPs[key]) {
      continue;
    }
    const list = localIPs[key] || [];
    for (const iface of list) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '';
}

async function buildWorker() {
  const options = buildUMD(path.join(distDir, 'worker.js'));
  options.entryPoints = [workPath];
  options.minify = !isDev;
  await build(options);
}

/**
 *
 * @param { import('esbuild').BuildOptions } options
 */
async function buildDev(options) {
  const ctx = await context(options);

  await ctx.watch();
  const { port } = await ctx.serve({
    servedir: distDir,
  });
  fs.writeFileSync(path.join(process.cwd(), 'port.txt'), String(port), 'utf-8');

  console.log(`http://localhost:${port}`);
  console.log(`http://${getIp()}:${port}`);
}

async function init() {
  deleteDir('lib');
  deleteDir('dist');
  await buildWorker();
  const options = buildESM('');
  /** @type {import('esbuild').BuildOptions} */
  const distOptions = {
    ...options,
    entryPoints: [path.join(__dirname, 'demo.tsx')],
    outdir: distDir,
    outfile: undefined,
    splitting: true,
  };
  if (isDev) {
    await buildDev(distOptions);
  } else {
    distOptions.minify = true;
    await buildProd(distOptions);
  }
  buildHtml();
}
init();

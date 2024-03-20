import { build, BuildOptions, context } from 'esbuild';
import packageJson from '../package.json';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { networkInterfaces } from 'os';

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

const nodeEnv = envConfig.nodeEnv || 'production';
const isDev = nodeEnv === 'development';

const licenseText = fs.readFileSync(
  path.join(process.cwd(), 'LICENSE'),
  'utf-8',
);
const globalName = '__export__';
const distDir = path.join(process.cwd(), 'dist');

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
    format: 'esm',
  });
}

/**
 * build umd
 */
function buildUMD(filePath: string): BuildOptions {
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

function buildBrowserConfig(options: BuildOptions): BuildOptions {
  const minify = !!options.outfile?.includes('.min.');
  const namespace = 'external-package';
  const externals: Record<string, string> = {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  };
  const realOptions: BuildOptions = {
    bundle: true,
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
                '^(' + Object.keys(externals).join('|') + ')$',
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
              const contents = `module.exports = ${externals[args.path]}`;
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

function deleteDir(dir: string) {
  const t = path.join(process.cwd(), dir);
  if (fs.existsSync(t)) {
    fs.rmSync(t, { recursive: true, force: true });
  }
}

async function buildProd() {
  const options = buildESM('');
  const distOptions: BuildOptions = {
    ...options,
    outdir: distDir,
    splitting: true,
    minify: true,
  };
  const list = await Promise.all(
    [
      distOptions,
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
    for (const iface of localIPs[key]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '';
}

async function buildDev() {
  const options = buildESM('');
  const ctx = await context({
    ...options,
    outfile: undefined,
    outdir: distDir,
    splitting: true,
  });

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
  if (isDev) {
    await buildDev();
  } else {
    await buildProd();
  }
  buildHtml();
}
init();

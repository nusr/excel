import { build, context, analyzeMetafile } from 'esbuild';
import packageJson from '../package.json';
import * as fs from 'fs';
import * as path from 'path';
import childProcess from 'child_process';
const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig['NODE_ENV'] || productionMode;
const isDev = nodeEnv === 'development';
const globalName = '__export__';
const licenseText = fs.readFileSync(path.join(process.cwd(), 'LICENSE'), 'utf-8');
const distDir = path.join(process.cwd(), 'dist');
function openBrowser(url) {
    let cmd = '';
    const args = [];
    if (process.platform === 'darwin') {
        try {
            childProcess.execSync(`osascript openChrome.applescript "${encodeURI(url)}"`, {
                cwd: __dirname,
                stdio: 'ignore',
            });
            return true;
        }
        catch (error) { }
        cmd = 'open';
    }
    else if (process.platform === 'win32') {
        cmd = 'cmd.exe';
        args.push('/c', 'start', '""', '/b');
        url = url.replace(/&/g, '^&');
    }
    else {
        cmd = 'xdg-open';
    }
    args.push(url);
    childProcess.spawn(cmd, args);
}
function getEnv() {
    const result = {};
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
function buildESM(filePath) {
    return buildBrowserConfig({
        outfile: filePath,
        format: 'esm',
    });
}
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
function buildBrowserConfig(options) {
    const minify = !!options.outfile?.includes('.min.');
    const realOptions = {
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
    };
    Object.assign(realOptions, options);
    return realOptions;
}
function buildHtml() {
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }
    const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    fs.writeFileSync(path.join(distDir, 'index.html'), data.replace('process.env.NODE_ENV', JSON.stringify(nodeEnv)));
}
function deleteDir(dir) {
    fs.rm(path.join(process.cwd(), dir), { recursive: true }, (error) => {
        if (error) {
            console.log(error);
        }
    });
}
async function main() {
    deleteDir('lib');
    deleteDir('dist');
    const options = buildESM('');
    const list = await Promise.all([
        {
            ...options,
            outdir: distDir,
            splitting: true,
            minify: true,
        },
        buildESM(packageJson.module),
        buildUMD(packageJson.main),
        buildESM(packageJson.module.replace('.js', '.min.js')),
        buildUMD(packageJson.main.replace('.js', '.min.js')),
    ].map(async (item) => {
        const result = await build(item);
        if (result.metafile) {
            console.log(await analyzeMetafile(result.metafile));
        }
        return result;
    }));
    buildHtml();
    return list;
}
async function liveReload() {
    deleteDir('dist');
    const options = buildESM('');
    const ctx = await context({
        ...options,
        outfile: undefined,
        outdir: distDir,
        splitting: true,
        minify: true,
    });
    await ctx.watch();
    const { port } = await ctx.serve({
        servedir: distDir,
    });
    const url = `http://localhost:${port}`;
    buildHtml();
    openBrowser(url);
    console.log(`running in: ${url}`);
}
function init() {
    if (isDev) {
        liveReload();
    }
    else {
        main();
    }
}
init();
//# sourceMappingURL=esbuild.js.map
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { transformSync } = require("esbuild");
const path = require("path");

const getExt = (str) => {
  const basename = path.basename(str);
  const firstDot = basename.indexOf(".");
  const lastDot = basename.lastIndexOf(".");
  const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, "$1");

  if (firstDot === lastDot) return extname;

  return basename.slice(firstDot, lastDot) + extname;
};

const getOptions = (config) => {
  let options = {};

  for (let i = 0; i < config.transform.length; i++) {
    options = config.transform[i][2];
  }

  return options;
};

// export interface Options {
//   jsxFactory?: string
//   jsxFragment?: string
//   sourcemap?: boolean | 'inline' | 'external'
//   loaders?: {
//     [ext: string]: Loader
//   },
//   target?: string
//   format?: string
// }

function process(content, filename, config) {
  const options /* : Options  */ = getOptions(config);

  const ext = getExt(filename);
  const loader =
    options?.loaders && options?.loaders[ext]
      ? options.loaders[ext]
      : path.extname(filename).slice(1);

  const sourcemaps = options?.sourcemap
    ? { sourcemap: true, sourcefile: filename }
    : {};
  const realOptions = {
    loader,
    format: options?.format || "cjs",
    target: options?.target || "es2018",
    ...(options?.jsxFactory ? { jsxFactory: options.jsxFactory } : {}),
    ...(options?.jsxFragment ? { jsxFragment: options.jsxFragment } : {}),
    ...sourcemaps,
  };
  const result = transformSync(content, realOptions);

  return {
    code: result.code,
    map: result?.map
      ? {
          ...JSON.parse(result.map),
          sourcesContent: null,
        }
      : "",
  };
}
module.exports = { process };

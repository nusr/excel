import { transformSync, TransformOptions } from 'esbuild';
import * as path from 'path';

const getExt = (str: string): string => {
  const basename = path.basename(str);
  const firstDot = basename.indexOf('.');
  const lastDot = basename.lastIndexOf('.');
  const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');

  if (firstDot === lastDot) return extname;

  return basename.slice(firstDot, lastDot) + extname;
};

const getOptions = (config: any) => {
  let options = {};
  const transform = config.transform || [];
  for (let i = 0; i < transform.length; i++) {
    options = transform[i][2];
  }

  return options;
};

interface Options {
  jsxFactory?: string;
  jsxFragment?: string;
  sourcemap?: boolean | 'inline' | 'external';
  loaders?: {
    [ext: string]: any;
  };
  target?: string;
  format?: TransformOptions['format'];
}

function process(content: string, filename: string, config: any) {
  const options: Options = getOptions(config);

  const ext = getExt(filename);
  const loader =
    options?.loaders && options?.loaders[ext]
      ? options.loaders[ext]
      : path.extname(filename).slice(1);
  const realOptions: TransformOptions = {
    loader,
    format: options?.format || 'cjs',
    target: options?.target || 'es2018',
  };
  if (options?.jsxFactory) {
    realOptions.jsxFactory = options.jsxFactory;
  }
  if (options?.jsxFragment) {
    realOptions.jsxFragment = options.jsxFragment;
  }
  if (options?.sourcemap) {
    realOptions.sourcemap = true;
    realOptions.sourcefile = filename;
  }
  const result = transformSync(content, realOptions);
  let map: any = '';
  if (result?.map) {
    const temp = JSON.parse(result.map);
    map = Object.assign(temp || {}, { sourcesContent: null });
  }
  return {
    code: result.code,
    map,
  };
}
export default { process };

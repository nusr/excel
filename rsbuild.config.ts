import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/index.tsx',
      worker: {
        import: './src/worker.ts',
        html: false,
        filename: 'worker.js',
      },
    },
    define: {
      'process.env.IS_E2E': JSON.stringify(process.env.IS_E2E || '')
    },
  },
  output: {
    assetPrefix: '/excel/',
    distPath: {
      js: '',
      css: '',
    },
  },
  html: {
    template: './public/index.html',
  },
});

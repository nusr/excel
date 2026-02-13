import { defineConfig, AliasOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { join } from 'path';
import { version } from './package.json'

type Options = {
  rules: {
    slot: string;
    html: string;
  }[];
};

function htmlSlot(options: Options) {
  const { rules } = options;

  return {
    name: 'html-slot',
    transformIndexHtml(indexHtml: string) {
      if (rules.length === 0) {
        return indexHtml;
      }
      for (const item of rules) {
        const { slot, html } = item;
        indexHtml = indexHtml.replace(slot, html);
      }

      return indexHtml;
    },
  };
}

export default defineConfig((env) => {
  const isDev = env.mode === 'development';

  let alias: AliasOptions = {};

  if (isDev) {
    alias = {
      'excel-collab': join(__dirname, '..', '..', 'excel-collab', 'src'),
    };
  }

  return {
    base: process.env.ROOT_BASE_URL ? process.env.ROOT_BASE_URL : undefined,
    plugins: [
      react(),
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'demo',
        uploadToken: process.env.CODECOV_TOKEN,
      }),
      htmlSlot({
        rules: [
          {
            slot: '<!--BUNDLE_INFO-->',
            html: `<script>window.__bundle_info = ${JSON.stringify({ time: new Date().toISOString(), commit_id: process.env.COMMIT_ID ?? `v${version}` })}</script>`,
          },
        ],
      }),
    ],
    build: {
      modulePreload: true,
      sourcemap: true,
      outDir: './dist',
      manifest: true,
    },
    resolve: {
      alias,
    },
    server: {
      port: 3000,
      open: false,
      host: true,
    },
  };
});

import { defineConfig, AliasOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { join } from 'path';
import { version } from './package.json';

function htmlSlot(options: Record<string, string>) {
  return {
    name: 'html-slot',
    transformIndexHtml(indexHtml: string) {
      for (const [key, value] of Object.entries(options)) {
        indexHtml = indexHtml.replace(key, value);
      }

      return indexHtml;
    },
  };
}

export default defineConfig((env) => {
  const isDev = env.mode === 'development';

  let alias: AliasOptions = {};

  if (isDev || env.mode === 'e2e') {
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
        '<!--BUNDLE_INFO-->': `<script>window.__bundle_info = ${JSON.stringify({ time: new Date().toISOString(), commit_id: process.env.COMMIT_ID ?? `v${version}` })}</script>`,
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

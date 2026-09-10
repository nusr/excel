import { defineConfig } from 'vite';
import type { AliasOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { join } from 'node:path';
import { version } from './package.json' with { type: 'json' };

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
  const isLocalMode = env.mode === 'development';
  const dirPath = join(import.meta.dirname, '..', '..', 'excel-collab', 'src');
  const alias: AliasOptions = isLocalMode
    ? {
        'excel-collab': dirPath,
      }
    : {};

  return {
    base: process.env.ROOT_BASE_URL || undefined,
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
      outDir: 'dist',
      manifest: true,
    },
    resolve: {
      alias,
      dedupe: ['yjs'],
    },
    server: {
      port: 3000,
      open: false,
      host: true,
    },
  };
});

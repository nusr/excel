import { defineConfig, AliasOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { join } from 'path';

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

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  base: process.env.ROOT_BASE_URL ? process.env.ROOT_BASE_URL : undefined,
  plugins: [
    react(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'demo',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  define: {
    'process.env.CI': JSON.stringify(process.env.CI ?? ''),
  },
  build: {
    sourcemap: true,
    outDir: './dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        collab: resolve(__dirname, 'collab.html'),
      },
    },
  },
});

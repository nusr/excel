import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.ROOT_BASE_URL ? process.env.ROOT_BASE_URL : undefined,
  plugins: [react()],
  define: {
    'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
    'process.env.CI': JSON.stringify(process.env.CI ?? ''),
  },
  build: {
    minify: false,
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
  worker: {
    format: 'es',
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.CI ? '/excel/' : undefined,
  plugins: [react()],
  define: {
    'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
  },
  build: {
    minify: false,
    sourcemap: true,
    outDir: './dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
      },
    },
  },
  worker: {
    format: 'es',
  },
});

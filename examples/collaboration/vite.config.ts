import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import { resolve } from 'path';

const commitLog = execSync('git log -1').toString();

export default defineConfig({
  base: process.env.CI ? '/excel/' : undefined,
  plugins: [react()],
  define: {
    'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
    'process.env.COMMIT_LOG': JSON.stringify(commitLog || ''),
  },
  build: {
    sourcemap: true,
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

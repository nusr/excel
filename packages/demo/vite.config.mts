import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { execSync } from 'child_process';

const log = execSync('git log -1').toString();

export default defineConfig({
  base: process.env.CI ? '/excel/' : '',
  plugins: [react()],
  define: {
    'process.env.IS_E2E': JSON.stringify(process.env.IS_E2E || ''),
    'process.env.COMMIT_LOG': JSON.stringify(log || ''),
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
});

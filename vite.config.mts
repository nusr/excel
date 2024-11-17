import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.CI ? '/excel/' : '',
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  define: {
    'process.env.IS_E2E': JSON.stringify(process.env.IS_E2E || ''),
  },
  build: {
    sourcemap: true,
  },
});

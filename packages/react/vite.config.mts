import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: process.env.NODE_ENV === 'production' ? '.' : './demo',
  plugins: [react(), dts()],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        worker: 'src/worker.ts',
      },
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  define: {
    'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E || ''),
  },
});

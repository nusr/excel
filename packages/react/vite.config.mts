import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: process.env.NODE_ENV === 'production' ? '.' : './demo',
  plugins: [dts()],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        excel: 'src/index.ts',
        worker: 'src/worker.ts',
      },
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
    'process.env.IS_E2E': JSON.stringify(process.env.IS_E2E || ''),
  },
});

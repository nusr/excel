import { defineConfig } from 'vite';
import { version } from './package.json';
import dts from 'vite-plugin-dts';

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

export default defineConfig({
  root: process.env.NODE_ENV === 'development' ? './playground' : undefined,
  plugins: [dts()],
  define: {
    'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
    'process.env.VERSION': JSON.stringify(version),
  },
  build: {
    sourcemap: true,
    outDir: 'lib',
    lib: {
      entry: {
        index: './src/index.ts',
        worker: './src/worker.ts',
      },
      cssFileName: 'style',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },

    rollupOptions: {
      external: ['react', 'react-dom', 'yjs'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          yjs: 'Y',
        },
      },
    },
  },
});

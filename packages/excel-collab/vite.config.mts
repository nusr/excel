import { defineConfig } from 'vite';
import { version } from './package.json';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  define: {
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
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.js`;
        }
        return `${entryName}.${format}.js`;
      },
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

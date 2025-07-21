import { defineConfig } from 'vite';
import { version } from './package.json';
import dts from 'vite-plugin-dts';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  plugins: [
    dts(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'excel-collab',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  define: {
    'process.env.VERSION': JSON.stringify(version),
  },
  build: {
    sourcemap: true,
    outDir: 'lib',
    lib: {
      entry: './src/index.ts',
      cssFileName: 'style',
      name: 'Excel',
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`;
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
});

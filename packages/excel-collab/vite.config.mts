import { defineConfig, esmExternalRequirePlugin } from 'vite';
import dts from 'vite-plugin-dts';
import { codecovVitePlugin } from '@codecov/vite-plugin';

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
  'yjs',
];

export default defineConfig({
  base: './',
  plugins: [
    // Let the plugin externalize peers so bundled CommonJS uses ESM imports.
    esmExternalRequirePlugin({ external }),
    dts(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'excel-collab',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  build: {
    sourcemap: true,
    outDir: 'lib',
    minify: false,
    lib: {
      entry: './src/index.ts',
      cssFileName: 'style',
      name: 'Excel',
      formats: ['es', 'umd'],
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`;
      },
    },

    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          'react/jsx-dev-runtime': 'ReactJsxDevRuntime',
          'react-dom/client': 'ReactDOMClient',
          yjs: 'Y',
        },
      },
    },
  },
  resolve: {
    dedupe: ['yjs'],
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version } from './package.json';
import dts from 'vite-plugin-dts';

export default defineConfig((env) => {
  const isProd = env.mode === 'production';

  return {
    root: isProd ? undefined : './playground',
    plugins: [isProd ? dts() : react()],
    define: {
      'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
      'process.env.VERSION': JSON.stringify(version),
    },
    build: {
      sourcemap: true,
      outDir: 'lib',
      lib: {
        entry: {
          excel: './src/index.ts',
          worker: './src/worker.ts',
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
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version } from './package.json';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig((env) => {
  const isLibrary = env.mode === 'production';

  return {
    base: process.env.CI && !isLibrary ? '/excel/' : undefined,
    plugins: isLibrary ? [dts()] : [react()],
    define: {
      'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
      'process.env.VERSION': JSON.stringify(version),
    },
    build: {
      sourcemap: true,
      outDir: isLibrary ? 'lib' : 'dist',
      lib: isLibrary
        ? {
            entry: {
              excel: './src/index.ts',
              worker: './src/worker.ts',
            },
            cssFileName: 'style',
          }
        : undefined,
      rollupOptions: isLibrary
        ? {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          }
        : {
            input: {
              main: resolve(__dirname, 'index.html'),
              app: resolve(__dirname, 'app.html'),
            },
          },
    },
  };
});

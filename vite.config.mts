import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { version } from './package.json';
import dts from 'vite-plugin-dts';

const commitLog = execSync('git log -1').toString();

export default defineConfig((env) => {
  const isLibraryMode = env.mode === 'lib';

  return {
    base: !isLibraryMode && process.env.CI ? '/excel/' : undefined,
    plugins: [isLibraryMode ? dts() : react()],
    define: {
      'process.env.VITE_IS_E2E': JSON.stringify(process.env.VITE_IS_E2E ?? ''),
      'process.env.COMMIT_LOG': JSON.stringify(commitLog || ''),
      'process.env.VERSION': JSON.stringify(version),
    },
    build: {
      sourcemap: true,
      outDir: isLibraryMode ? 'lib' : 'dist',
      lib: isLibraryMode
        ? {
            entry: {
              excel: './src/index.ts',
              worker: './src/worker.ts',
            },
            cssFileName: 'style',
          }
        : undefined,
      rollupOptions: isLibraryMode
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
              simple: resolve(__dirname, 'simple.html'),
            },
          },
    },
  };
});

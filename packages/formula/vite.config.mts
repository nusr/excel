import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: process.env.NODE_ENV === 'production' ? '.' : './demo',
  plugins: [dts()],
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'Formula',
      fileName: 'formula',
    }
  },
});

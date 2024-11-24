import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],

  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'Shared',
      fileName: 'shared',
    }
  },
});

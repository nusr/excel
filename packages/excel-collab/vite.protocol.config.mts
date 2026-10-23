import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'lib',
    emptyOutDir: false,
    lib: {
      entry: './src/protocol.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'protocol.mjs' : 'protocol.cjs'),
    },
    rollupOptions: { external: ['yjs'] },
  },
});

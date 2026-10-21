import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    testTimeout: 15000,
    environment: 'jsdom',
    pool: 'vmThreads',
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    setupFiles: [fileURLToPath(new URL('./vitest.setup.ts', import.meta.url))],
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'json', 'lcov', 'text', 'html'],
    },
  },
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/excel-collab/vitest.config.ts',
      'packages/demo/frontend/vitest.config.ts',
      'packages/demo/backend/vitest.config.ts',
    ],
    maxWorkers: 2,
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'json', 'lcov', 'text', 'html'],
    },
  },
});

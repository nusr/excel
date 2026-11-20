import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/excel-collab/vitest.config.mts',
      'packages/demo/frontend/vitest.config.mts',
      'packages/demo/backend/vitest.config.mts',
    ],
    maxWorkers: 2,
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'json', 'lcov', 'text', 'html'],
    },
  },
});

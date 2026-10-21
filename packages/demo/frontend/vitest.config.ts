import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import config from '../../../scripts/vitest.config';

export default mergeConfig(
  config,
  defineConfig({
    root: fileURLToPath(new URL('.', import.meta.url)),
    test: { name: 'frontend' },
  }),
);

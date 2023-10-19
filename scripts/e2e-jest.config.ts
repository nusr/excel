import * as path from 'path';
import type { Config } from 'jest';

const rootDir = path.join(process.cwd());
const config: Config = {
  rootDir,
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': path.join(__dirname, 'transform.js'),
  },
  testMatch: ['<rootDir>/e2e/**/*.test.[jt]s?(x)'],
  collectCoverage: false,
  coverageReporters: ['text', 'lcov', 'json', 'json-summary', 'html'],
  globalSetup: path.join(__dirname, 'e2e-global-setup.js'),
  globalTeardown: path.join(__dirname, 'e2e-global-teardown.js'),
};
export default config;

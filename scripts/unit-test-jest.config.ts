import * as path from 'path';
import type { Config } from 'jest';

const rootDir = process.cwd();

const config: Config = {
  rootDir,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.css$': path.join(__dirname, 'transform-css.js'),
    '^.+\\.(ts|tsx)$': path.join(__dirname, 'transform.js'),
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src/*.{ts,tsx}',
    '!src/types/*.{ts,tsx}',
  ],

  coverageReporters: [
    'json',
    'lcov',
    'text',
    'clover',
    'html',
    'json-summary',
    'html-spa',
  ],

  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  // maxConcurrency: 1,
  // maxWorkers: '50%',
};

export default config;

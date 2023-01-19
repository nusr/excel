import * as path from 'path';

const rootDir = process.cwd();
const transformPath = path.join(__dirname, 'transform.js');
console.log('rootDir:', rootDir);

export default {
  rootDir,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': transformPath,
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/canvas/*.{ts,tsx}',
    '!src/types/*.{ts,tsx}',
    '!src/**/*.d.ts',
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

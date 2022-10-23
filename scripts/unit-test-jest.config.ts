import * as path from 'path';

const rootDir = process.cwd();
const transformPath = path.join(__dirname, 'transform.js');
export default {
  rootDir,
  testEnvironment: "jsdom",
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': transformPath,
  },
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/scripts/**',
    '!**/assets/**',
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
    "@/(.*)": "<rootDir>/src/$1",
  },
  maxConcurrency: 1,
  maxWorkers: "50%",
};

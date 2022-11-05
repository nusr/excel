import * as path from 'path';
import * as fs from 'fs';

const rootDir = process.cwd();
const transformPath = path.join(__dirname, 'transform.js');
fs.rm(path.join(process.cwd(), 'dist'), { recursive: true }, (error) => {
  if (error) {
    console.log(error);
  }
});
export default {
  rootDir,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': transformPath,
  },
  collectCoverageFrom: [
    'src/formula/**/*.{ts,tsx}',
    'src/lodash/**/*.{ts,tsx}',
    'src/parser/**/*.{ts,tsx}',
    'src/util/**/*.{ts,tsx}',
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
  maxConcurrency: 1,
  maxWorkers: '50%',
};

const path = require('path');

const rootDir = process.cwd();
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.css$': path.join(rootDir, './scripts/transform-css.js'),
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],

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
    '\\.css$': path.join(rootDir, './scripts/style-mock.js'),
  },
};

const path = require('path');
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.css$': path.join(__dirname, './css-transform.js'),
  },
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '\\.css$': path.join(__dirname, './css-mock.js'),
  },
  setupFiles: [path.join(__dirname, './jest.setup.js')],
};

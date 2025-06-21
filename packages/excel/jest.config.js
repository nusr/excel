const path = require('path');
const scriptDir = path.join(__dirname, '../../scripts/');
process.env.VITE_IS_E2E = 'true';
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.css$': path.join(scriptDir, './css-transform.js'),
  },
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '\\.css$': path.join(scriptDir, './css-mock.js'),
  },
  setupFiles: [path.join(scriptDir, './jest.setup.js')],
};

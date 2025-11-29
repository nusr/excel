const path = require('path');
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.css$': path.join(__dirname, './css-transform.js'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!uuid)',
    'node_modules/(?!pixelmatch)',
  ],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '\\.css$': path.join(__dirname, './css-mock.js'),
    '^uuid$': require.resolve('uuid'),
    '^pixelmatch$': require.resolve('pixelmatch'),
  },
  setupFiles: [path.join(__dirname, './jest.setup.js')],
};

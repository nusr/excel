/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.css$': '<rootDir>/scripts/css-transform.js',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', 'src/*.{ts,tsx,js,jsx}'],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.css$': '<rootDir>/scripts/css-mock.js',
  },
  setupFiles: ['<rootDir>/scripts/jest.setup.js']
};

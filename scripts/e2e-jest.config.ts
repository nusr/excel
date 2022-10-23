import * as path from 'path'

const transformPath = path.join(__dirname, 'transform.js');;
const rootDir = path.join(process.cwd());
export default {
  rootDir,
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': transformPath,
  },
  testMatch: ['<rootDir>/e2e/**/*.test.[jt]s?(x)'],
  collectCoverage: false,
  coverageReporters: ['text', 'lcov', 'json', 'json-summary', 'html'],
};
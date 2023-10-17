import * as path from 'path';
const rootDir = path.join(process.cwd());
export default {
    rootDir,
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': path.join(__dirname, 'transform.js'),
    },
    testMatch: ['<rootDir>/e2e/**/*.test.[jt]s?(x)'],
    collectCoverage: false,
    coverageReporters: ['text', 'lcov', 'json', 'json-summary', 'html'],
};
//# sourceMappingURL=e2e-jest.config.js.map
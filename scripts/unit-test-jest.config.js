import * as path from 'path';
const rootDir = process.cwd();
export default {
    rootDir,
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
    transform: {
        '^.+\\.css$': path.join(__dirname, 'transform-css.js'),
        '^.+\\.(ts|tsx)$': path.join(__dirname, 'transform.js'),
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/canvas/*.{ts,tsx}',
        '!src/types/*.{ts,tsx}',
        '!src/react/hooks.ts',
        '!src/react/vNode.ts',
        '!src/react/modules/module.ts',
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
};
//# sourceMappingURL=unit-test-jest.config.js.map
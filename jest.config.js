/** @type {import('ts-jest').JestConfigWithTsJest} */
process.env.VITE_IS_E2E = 'true';
module.exports = {
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.css$': '<rootDir>/scripts/css-transform.js',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  VITE_IS_E2E: 'true',
                  VITE_DEFAULT_EXCEL_ID: '',
                },
              },
            },
          ],
        },
      },
    ],
  },
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/scripts/css-mock.js',
  },
  setupFiles: ['<rootDir>/scripts/jest.setup.js'],
};

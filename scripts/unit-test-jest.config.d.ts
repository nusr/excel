declare const _default: {
    rootDir: string;
    testEnvironment: string;
    testMatch: string[];
    transform: {
        '^.+\\.css$': string;
        '^.+\\.(ts|tsx)$': string;
    };
    collectCoverageFrom: string[];
    coverageReporters: string[];
    moduleNameMapper: {
        '@/(.*)': string;
    };
};
export default _default;

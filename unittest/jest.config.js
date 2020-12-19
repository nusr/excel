/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const rootDir = path.join(__dirname, "..");
module.exports = {
  preset: "ts-jest",
  rootDir,
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  // collectCoverage: true,
  collectCoverageFrom: [
    "**/src/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/scripts/**",
    "!**/assets/**",
  ],
};

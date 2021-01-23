/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const rootDir = path.join(__dirname, "..");
module.exports = {
  rootDir,
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
  collectCoverageFrom: [
    "**/src/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/scripts/**",
    "!**/assets/**",
  ],
};

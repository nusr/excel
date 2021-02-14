/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const rootDir = path.join(__dirname, "..");
const transformPath = path.join(__dirname, "transform.js");
module.exports = {
  rootDir,
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.tsx?$": transformPath,
  },
  collectCoverageFrom: [
    "**/src/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/scripts/**",
    "!**/assets/**",
  ],
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "clover",
    "html",
    "json-summary",
    "html-spa",
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};

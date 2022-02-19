/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const rootDir = path.join(process.cwd());
console.log("rootDir", rootDir);
const transformPath = path.join(process.cwd(), "unittest", "transform.js");
const setup = path.join(__dirname, "setup.js");
const reporter = path.join(__dirname, "reporter.js");
module.exports = {
  rootDir,
  testEnvironment: "node",
  testMatch: ["<rootDir>/e2e/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.tsx?$": transformPath,
  },
  collectCoverage: false,
  collectCoverageFrom: ["dist/**/*.js"],
  coverageReporters: ["text", "lcov", "json", "json-summary", "html"],
  // maxConcurrency: 1,
  // maxWorkers: "50%",
  setupFilesAfterEnv: [setup],
  reporters: ["default", reporter],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverageStorage = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
class CoverageStorage {
    constructor(coverageDir = "coverage") {
        this.coverageDirPath = coverageDir;
        this.coverageJsonPath = (0, path_1.join)(this.coverageDirPath, "coverage-puppeteer-istanbul.json");
    }
    read() {
        if ((0, fs_1.existsSync)(this.coverageJsonPath)) {
            try {
                return JSON.parse((0, fs_1.readFileSync)(this.coverageJsonPath, "utf-8"));
            }
            catch (error) {
                return {};
            }
        }
        return {};
    }
    write(coverage) {
        // Node v8 has not `recursive` option. So make sure that `coverageDirPath` doesn't exist before `mkdirSync`.
        if (!(0, fs_1.existsSync)(this.coverageDirPath)) {
            (0, fs_1.mkdirSync)(this.coverageDirPath, { recursive: true });
        }
        (0, fs_1.writeFileSync)(this.coverageJsonPath, JSON.stringify(coverage.data), "utf-8");
    }
    delete() {
        if ((0, fs_1.existsSync)(this.coverageJsonPath)) {
            (0, fs_1.unlinkSync)(this.coverageJsonPath);
        }
    }
}
exports.CoverageStorage = CoverageStorage;

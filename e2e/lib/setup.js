"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const storage_1 = require("./storage");
const coverageStorage = new storage_1.CoverageStorage(process.env.JEST_PUPPETEER_ISTANBUL_DIR);
function getCoverage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const coverage = yield page.evaluate(() => window.__coverage__);
        return (0, istanbul_lib_coverage_1.createCoverageMap)(coverage);
    });
}
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.JEST_PUPPETEER_ISTANBUL_COVERAGE !== "true")
        return;
    if (typeof page === "undefined")
        return;
    const coverageMap = yield getCoverage(page);
    coverageMap.merge(coverageStorage.read());
    coverageStorage.write(coverageMap);
}));

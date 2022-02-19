"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const transform_1 = require("@jest/transform");
const reporters_1 = require("@jest/reporters");
const storage_1 = require("./storage");
class PuppeteerIstanbul extends reporters_1.CoverageReporter {
    constructor(globalConfig, _options) {
        const coverageReporters = [...(globalConfig.coverageReporters || [])];
        // Remove "text" or "text-summary" from the origin config. Because the text result output by
        // the origin CoverageReporter doesn't include puppeteer information.
        let reporterIndex;
        if ((reporterIndex = globalConfig.coverageReporters.indexOf("text")) >= 0)
            globalConfig.coverageReporters.splice(reporterIndex, 1);
        if ((reporterIndex = globalConfig.coverageReporters.indexOf("text-summary")) >= 0)
            globalConfig.coverageReporters.splice(reporterIndex, 1);
        super(Object.assign(Object.assign({}, globalConfig), { coverageReporters: coverageReporters }), _options);
        this.shouldInstrumentOptions = {
            collectCoverage: globalConfig.collectCoverage,
            collectCoverageFrom: globalConfig.collectCoverageFrom,
            collectCoverageOnlyFrom: globalConfig.collectCoverageOnlyFrom,
            coverageProvider: globalConfig.coverageProvider,
            changedFiles: undefined,
        };
        this.collectCoverage = globalConfig.collectCoverage;
        // Using environment variable to communicate between reporter and setup
        process.env.JEST_PUPPETEER_ISTANBUL_DIR = globalConfig.coverageDirectory;
        process.env.JEST_PUPPETEER_ISTANBUL_COVERAGE = this.collectCoverage ? "true" : "false";
        this.coverageStorage = new storage_1.CoverageStorage(globalConfig.coverageDirectory);
    }
    onRunStart(_results, _options) {
        debugger
        if (this.collectCoverage) {
            this.coverageStorage.delete();
            return super.onRunStart(_results, _options);
        }
    }
    onTestResult(test, testResult) {
        debugger
        if (this.collectCoverage) {
            const coverage = (0, istanbul_lib_coverage_1.createCoverageMap)({});
            const mergeFileCoverage = ([filename, fileCoverage]) => {
                if ((0, transform_1.shouldInstrument)(filename, this.shouldInstrumentOptions, test.context.config)) {
                    coverage.merge({ [filename]: fileCoverage });
                }
            };
            Object.entries(this.coverageStorage.read()).map(mergeFileCoverage);
            if (testResult.coverage) {
                Object.entries(testResult.coverage).map(mergeFileCoverage);
            }
            if (Object.keys(coverage).length) {
                testResult.coverage = coverage.data;
            }
            return super.onTestResult(test, testResult);
        }
    }
    onRunComplete(contexts, aggregatedResults) {
        debugger
        if (this.collectCoverage) {
            return super.onRunComplete(contexts, aggregatedResults);
        }
        else {
            return Promise.resolve();
        }
    }
}
exports.default = PuppeteerIstanbul;

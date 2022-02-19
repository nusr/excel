import { CoverageReporter } from "@jest/reporters";
import { TestResult } from "@jest/test-result";
import { Test } from "jest-runner";
import { Config } from "@jest/types";
declare class PuppeteerIstanbul extends CoverageReporter {
    private collectCoverage;
    private coverageStorage;
    private shouldInstrumentOptions;
    constructor(globalConfig: Config.GlobalConfig, _options?: any);
    onRunStart(_results: any, _options: any): void;
    onTestResult(test: Test, testResult: TestResult): void;
    onRunComplete(contexts: any, aggregatedResults: any): Promise<void>;
}
export default PuppeteerIstanbul;

import { CoverageMap, CoverageMapData } from "istanbul-lib-coverage";
export declare class CoverageStorage {
    private coverageDirPath;
    private coverageJsonPath;
    constructor(coverageDir?: string);
    read(): CoverageMapData;
    write(coverage: CoverageMap): void;
    delete(): void;
}

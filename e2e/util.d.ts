import * as puppeteer from 'puppeteer';
declare global {
    var page: puppeteer.Page;
}
export declare function sleep(milliseconds: number): Promise<unknown>;
export declare function openPage(): Promise<void>;
export declare function getTestIdSelector(testId: string): string;

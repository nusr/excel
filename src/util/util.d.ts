import type { WorksheetType } from '@/types';
export declare const isString: (value: any) => boolean;
export declare function isNumber(value: any): boolean;
export declare function parseNumber(value: any): number;
export declare function parseNumberArray(list: any[]): number[];
export declare function getListMaxNum(list?: string[]): number;
export declare function getDefaultSheetInfo(list?: WorksheetType[]): Pick<WorksheetType, 'name' | 'sheetId'>;
export declare function isTestEnv(): boolean;
export declare function isDevEnv(): boolean;

import type { ErrorTypes } from '@/types';
export declare class CustomError extends Error {
    readonly value: ErrorTypes;
    constructor(value: ErrorTypes);
}
export declare const paramsError: CustomError;
export declare const resultError: CustomError;
export declare function assert(condition: boolean, message?: ErrorTypes): asserts condition;
export declare function mustOne(list: any[]): any;
export declare function mustOneString(list: any[]): string;
export declare function mustOneNumber(list: any[]): number;
export declare function mustEmpty(list: any[]): void;

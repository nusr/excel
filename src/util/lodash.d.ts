export declare const debounce: (fn: (...params: any[]) => void) => (...rest: any[]) => void;
export declare function get<T>(obj: Record<string, any> | null | undefined, path: string, defaultValue?: T): T;
export declare function isEmpty(value: unknown): boolean;
export declare function setWith<ValueType>(obj: Record<string, any> | null | undefined, path: string, value: ValueType): Record<string, any> | null | undefined;
export declare function isObjectEqual(a: any, b: any): boolean;
export declare function deepEqual(x: any, y: any): boolean;
export declare function isPlainObject(value: any): boolean;

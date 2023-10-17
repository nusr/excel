type StoreListener = () => void;
type PrimitiveType = boolean | number | string | null | undefined;
type PlainObject = Record<string, PrimitiveType>;
type BaseStoreType = PrimitiveType | PlainObject | Array<PlainObject>;
export declare class BaseStore<T extends BaseStoreType> {
    private listeners;
    private state;
    constructor(initValue: T);
    setState: (data: T) => void;
    mergeState: (data: Partial<T>) => void;
    subscribe: (listener: StoreListener) => () => void;
    getSnapshot: () => T;
    private emitChange;
}
export {};

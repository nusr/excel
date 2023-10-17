import type { StyleType, ResultType } from '@/types';
import { BaseStore } from './base';
export type CellStoreType = Partial<StyleType> & {
    value: ResultType;
    formula?: string;
    top: number;
    left: number;
    width: number;
    height: number;
    row: number;
    col: number;
};
export declare const activeCellStore: BaseStore<CellStoreType>;

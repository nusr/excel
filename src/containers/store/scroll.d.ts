import { BaseStore } from './base';
export type ScrollStore = {
    scrollTop: number;
    scrollLeft: number;
};
export declare const scrollStore: BaseStore<ScrollStore>;

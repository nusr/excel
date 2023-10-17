import { BaseStore } from './base';
type CoreStore = {
    currentSheetId: string;
    isCellEditing: boolean;
};
export declare const coreStore: BaseStore<CoreStore>;
export {};

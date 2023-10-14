import { BaseStore } from './base';
export type CoreStore = {
  currentSheetId: string;
  isCellEditing: boolean;
};

export const coreStore = new BaseStore<CoreStore>({
  currentSheetId: '',
  isCellEditing: false,
});

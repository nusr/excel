import { BaseStore } from './base';
export type CoreStore = {
  currentSheetId: string;
  isCellEditing: boolean;
  scrollTop: number;
  scrollLeft: number;
};

export const coreStore = new BaseStore<CoreStore>({
  currentSheetId: '',
  isCellEditing: false,
  scrollTop: 0,
  scrollLeft: 0,
});

import { BaseStore } from './base';
import { ExtendIndex } from '@/types';
interface CoreStore {
  currentSheetId: string;
  isCellEditing: boolean;
}

export const coreStore = new BaseStore<CoreStore & ExtendIndex>({
  currentSheetId: '',
  isCellEditing: false,
});

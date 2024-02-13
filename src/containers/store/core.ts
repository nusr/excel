import { BaseStore } from './base';
import { EditorStatus } from '@/types';
export interface CoreStore {
  currentSheetId: string;
  editorStatus: EditorStatus;
  canRedo: boolean;
  canUndo: boolean;
}

export const coreStore = new BaseStore<CoreStore>({
  currentSheetId: '',
  editorStatus: EditorStatus.NONE,
  canRedo: false,
  canUndo: false,
});

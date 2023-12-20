import { BaseStore } from './base';
import { ExtendIndex, EditorStatus } from '@/types';
export interface CoreStore {
  currentSheetId: string;
  editorStatus: EditorStatus;
  canRedo: boolean;
  canUndo: boolean;
}

export const coreStore = new BaseStore<CoreStore & ExtendIndex>({
  currentSheetId: '',
  editorStatus: EditorStatus.NONE,
  canRedo: false,
  canUndo: false,
});

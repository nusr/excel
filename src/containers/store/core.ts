import { BaseStore } from './base';
import { EditorStatus } from '../../types';
export interface CoreStore {
  editorStatus: EditorStatus;
  canRedo: boolean;
  canUndo: boolean;
  activeUuid: string;
  currentSheetId: string;
  isFilter: boolean;
}

export const coreStore = new BaseStore<CoreStore>({
  editorStatus: EditorStatus.NONE,
  canRedo: false,
  canUndo: false,
  activeUuid: '',
  currentSheetId: '',
  isFilter: false,
});

import { BaseStore } from './base';
import { EditorStatus } from '@/types';
export interface CoreStore {
  editorStatus: EditorStatus;
  canRedo: boolean;
  canUndo: boolean;
}

export const coreStore = new BaseStore<CoreStore>({
  editorStatus: EditorStatus.NONE,
  canRedo: false,
  canUndo: false,
});

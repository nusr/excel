import { BaseStore } from './base';
import { ExtendIndex, EditorStatus } from '@/types';
interface CoreStore {
  currentSheetId: string;
  editorStatus: EditorStatus;
}

export const coreStore = new BaseStore<CoreStore & ExtendIndex>({
  currentSheetId: '',
  editorStatus: EditorStatus.NONE,
});

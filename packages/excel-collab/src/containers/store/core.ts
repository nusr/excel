import {
  EditorStatus,
  OptionItem,
  WorksheetType,
  DrawingElement,
} from '../../types';
import { create } from 'zustand';

export type SheetItem = Required<
  Pick<WorksheetType, 'sheetId' | 'isHide' | 'name' | 'tabColor'>
>;

export type FloatElementItem = DrawingElement & {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
  top: number;
  left: number;
};

export interface CoreStore {
  editorStatus: EditorStatus;
  canRedo: boolean;
  canUndo: boolean;
  activeUuid: string;
  currentSheetId: string;
  isFilter: boolean;
  defineNames: string[];
  fontFamilies: OptionItem[];
  sheetList: SheetItem[];
  drawings: FloatElementItem[];
}

type Action = {
  setActiveUuid(uuid: string): void;
  setEditorStatus(status: EditorStatus): void;
  setDefineNames(list: string[]): void;
  setFontFamilies(list: OptionItem[]): void;
  setSheetList(list: SheetItem[]): void;
  setDrawings(drawings: FloatElementItem[]): void;
};

const initState: CoreStore = {
  editorStatus: EditorStatus.NONE,
  canRedo: false,
  canUndo: false,
  activeUuid: '',
  currentSheetId: '',
  isFilter: false,
  defineNames: [],
  sheetList: [],
  fontFamilies: [],
  drawings: [],
};

export const useCoreStore = create<CoreStore & Action>((set) => ({
  ...initState,
  setActiveUuid(uuid) {
    set({ activeUuid: uuid });
  },
  setEditorStatus(status) {
    set({ editorStatus: status });
  },
  setDefineNames(list) {
    set({ defineNames: list });
  },
  setFontFamilies(list) {
    set({ fontFamilies: list });
  },
  setSheetList(list) {
    set({ sheetList: list });
  },
  setDrawings(drawings) {
    set({ drawings: drawings });
  },
}));

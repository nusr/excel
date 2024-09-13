import { ResultType } from './parser';
import { IRange } from './range';
import {
  WorkBookJSON,
  WorksheetType,
  ChangeEventType,
  WorksheetData,
} from './model';
import { ThemeType, CanvasOverlayPosition, ScrollValue } from './components';
import type { Remote } from 'comlink'
export interface IWindowSize {
  width: number;
  height: number;
}

export interface IPosition {
  top: number;
  left: number;
}

export type RequestFormula = {
  worksheets: WorkBookJSON['worksheets'];
  definedNames: Record<string, IRange>;
  currentSheetId: string;
  workbook: WorksheetType[];
};
export type RequestRender = {
  changeSet: Set<ChangeEventType>;
  theme: ThemeType;
  canvasSize: CanvasOverlayPosition;
  headerSize: IWindowSize;
  currentSheetInfo: WorksheetType;
  scroll: ScrollValue;
  range: IRange;
  customHeight: WorkBookJSON['customHeight'];
  customWidth: WorkBookJSON['customWidth'];
  copyRange: IRange | undefined;
  currentMergeCells: IRange[];
  sheetData: WorksheetData;
};
export type RequestInit = { canvas: OffscreenCanvas; dpr: number }
export type ResponseFormula = {
  list: Array<{ key: string; newValue: ResultType; sheetId: string }>;
};
export type ResponseRender = {
  rowMap: Record<string, number>;
  colMap: Record<string, number>;
};
export interface WorkerMainView {
  /**
   * clear offScreenCanvas
   * render offScreenCanvas
   */
  render(data: RequestRender): void;
  /**
   * resize canvas
   * resize offScreenCanvas
   */
  resize(data: IWindowSize): void;
}

export type WorkerMethod = {
  init(data: RequestInit): void
  resize(data: IWindowSize): void
  render(data: RequestRender, cb: (data: ResponseRender) => void): Promise<void>
  computeFormulas(data: RequestFormula, cb: (data: ResponseFormula) => void): Promise<void>
}

export type RemoteWorkerMethod = Remote<WorkerMethod>

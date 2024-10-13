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
export type RequestFormulas = {
  worksheets: WorkBookJSON['worksheets'];
  definedNames: Record<string, IRange>;
  currentSheetId: string;
  workbook: WorksheetType[];
}

export type ResponseFormulas = {
  list: Array<{ key: string; newValue: ResultType; sheetId: string }>;
  result?: ResultType[];
}

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
  computeFormulas(data: RequestFormulas, cb: (data: ResponseFormulas) => void): void
}

export type RemoteWorkerMethod = Remote<WorkerMethod>

export type WorkerType = Pick<WorkerMethod, 'computeFormulas'>
export type RemoteWorkerType = Remote<WorkerType>

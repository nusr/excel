import { ResultType } from './parser';
import { IRange } from './range';
import {
  WorkBookJSON,
  WorksheetType,
  ChangeEventType,
  WorksheetData,
} from './model';
import { ThemeType, CanvasOverlayPosition, ScrollValue } from './components';
export interface IWindowSize {
  width: number;
  height: number;
}

export interface IPosition {
  top: number;
  left: number;
}

export type RequestFormula = {
  status: 'formula';
  worksheets: WorkBookJSON['worksheets'];
  definedNames: Record<string, IRange>;
  currentSheetId: string;
  workbook: WorksheetType[];
};
export type RequestRender = {
  status: 'render';
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
export type RequestResize = {
  status: 'resize';
  width: number;
  height: number;
};
export type RequestMessageType =
  | RequestFormula
  | { status: 'init'; canvas: OffscreenCanvas; dpr: number }
  | RequestRender
  | RequestResize;
export type ResponseFormula = {
  status: 'formula';
  list: Array<{ key: string; newValue: ResultType; sheetId: string }>;
};
export type ResponseMessageType =
  | ResponseFormula
  | {
      status: 'render';
      rowMap: Record<string, number>;
      colMap: Record<string, number>;
    };

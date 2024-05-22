import { ResultType } from './parser';
import { IRange } from './range';
import { WorkBookJSON, WorksheetType } from './model';
export interface IWindowSize {
  width: number;
  height: number;
}

export interface IPosition {
  top: number;
  left: number;
}

export type RequestMessageType = {
  worksheets: WorkBookJSON['worksheets'];
  definedNames: Record<string, IRange>;
  currentSheetId: string;
  workbook: WorksheetType[];
};

export type ResponseMessageType = {
  list: Array<{ key: string; newValue: ResultType; sheetId: string }>;
};

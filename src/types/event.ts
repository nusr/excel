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
  activeCell: IRange;
  workbook: WorksheetType[];
};

export type ResponseMessageType = {
  sheetId: string;
  list: Array<{ key: string; newValue: ResultType }>;
};

import { WorkBookJSON, StyleType, WorksheetType } from './model';
import { Coordinate, CellInfo } from './components';
import { IRange } from './range';
import { IScrollValue } from './scroll';
import { ChangeEventType } from './event';

export enum EBorderLineType {
  MEDIUM,
  THICK,
  DASHED,
  DOTTED,
  DOUBLE,
}
export type IHooks = {
  modelChange: (val: Set<ChangeEventType>) => void;
};
export interface IController extends IScrollValue {
  getSheetInfo(sheetId?: string): WorksheetType;
  getCellsContent(sheetId?: string): Array<Coordinate>;
  getRanges(): IRange[];
  setHooks(hooks: IHooks): void;
  getActiveCell(): Coordinate;
  setActiveCell(
    row: number,
    col: number,
    colCount: number,
    rowCount: number,
  ): void;
  setCurrentSheetId(sheetId: string): void;
  getCurrentSheetId(): string;
  addSheet(): void;
  selectAll(row: number, col: number): void;
  selectCol(row: number, col: number): void;
  selectRow(row: number, col: number): void;
  fromJSON(json: WorkBookJSON): void;
  toJSON(): WorkBookJSON;
  updateSelection(row: number, col: number): void;
  windowResize(): void;
  setCellStyle(style: Partial<StyleType>, ranges?: IRange[]): void;
  setCellValue(data: Coordinate, value: string): void;
  getCell(data: Coordinate): CellInfo;
  canRedo(): boolean;
  canUndo(): boolean;
  undo(): void;
  redo(): void;
  getSheetList(): WorkBookJSON['workbook'];
}

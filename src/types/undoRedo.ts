import type { StyleType, ResultType, IRange } from '.';
type AddSheet = {
  type: 'addSheet';
  sheetId: string;
  name: string;
};
type SetCellValues = {
  type: 'setCellValues';
  value: ResultType[][];
  style: Partial<StyleType>[][];
  ranges: IRange[];
};
type SetActiveCell = {
  type: 'setActiveCell';
  range: IRange
};
type SetCellStyle = {
  type: 'setCellStyle';
  value: Partial<StyleType>;
  ranges: IRange[];
};

export type Operation = AddSheet | SetCellValues | SetActiveCell | SetCellStyle;

export interface BaseCommand {
  execute(): void;
  undo(): void;
}

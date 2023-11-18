export interface IRange {
  row: number;
  col: number;
  rowCount: number;
  colCount: number;
  sheetId: string;
}

export interface NumberFormatItem {
  formatCode: string;
  label: string;
  id: number;
}

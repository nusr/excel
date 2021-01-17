import { IRange } from "@/types";
export function isSheet(range: IRange): boolean {
  return isRow(range) && isCol(range);
}
export function isRow(range: IRange): boolean {
  return range.col === range.colCount && range.colCount === 0;
}
export function isCol(range: IRange): boolean {
  return range.row === range.colCount && range.colCount === 0;
}
export class Range implements IRange {
  row = 0;
  col = 0;
  colCount = 0;
  rowCount = 0;
  sheetId = "";
  constructor(
    row: number,
    col: number,
    rowCount: number,
    colCount: number,
    sheetId: string
  ) {
    this.row = row;
    this.col = col;
    this.colCount = colCount;
    this.rowCount = rowCount;
    this.sheetId = sheetId;
  }
  toIRange(): IRange {
    const { row, col, rowCount, colCount, sheetId } = this;
    return { row, col, rowCount, colCount, sheetId };
  }
  isSheet(): boolean {
    return isSheet(this.toIRange());
  }
  isRow(): boolean {
    return isRow(this.toIRange());
  }
  isCol(): boolean {
    return isCol(this.toIRange());
  }
  static makeRange(range: IRange): Range {
    return new Range(
      range.row,
      range.col,
      range.rowCount,
      range.colCount,
      range.sheetId
    );
  }
}

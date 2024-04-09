import { IRange } from '@/types';

export function isSheet(range: IRange): boolean {
  return isRow(range) && isCol(range);
}
export function isRow(range: IRange): boolean {
  return range.colCount === 0;
}
export function isCol(range: IRange): boolean {
  return range.rowCount === 0;
}

export function isSameRange(oldRange: IRange, newRange: IRange): boolean {
  return (
    oldRange.col === newRange.col &&
    oldRange.row === newRange.row &&
    oldRange.colCount === newRange.colCount &&
    oldRange.rowCount === newRange.rowCount &&
    oldRange.sheetId === newRange.sheetId
  );
}

export function containRange(row: number, col: number, range: IRange): boolean {
  return (
    row >= range.row &&
    row < range.row + range.rowCount &&
    col >= range.col &&
    col < range.col + range.colCount
  );
}

export class Range implements IRange {
  row = 0;
  col = 0;
  colCount = 0;
  rowCount = 0;
  sheetId = '';
  constructor(
    row: number,
    col: number,
    rowCount: number,
    colCount: number,
    sheetId: string,
  ) {
    this.row = row;
    this.col = col;
    this.colCount = colCount;
    this.rowCount = rowCount;
    this.sheetId = sheetId;
  }

  isValid(): boolean {
    return (
      this.row >= 0 && this.col >= 0 && this.colCount >= 0 && this.rowCount >= 0
    );
  }
  static makeRange(range: IRange): Range {
    return new Range(
      range.row,
      range.col,
      range.rowCount,
      range.colCount,
      range.sheetId,
    );
  }
  toIRange(): IRange {
    return {
      row: this.row,
      col: this.col,
      rowCount: this.rowCount,
      colCount: this.colCount,
      sheetId: this.sheetId,
    };
  }
}

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

export function containRange(
  sourceRange: IRange,
  targetRange: IRange,
): boolean {
  if (sourceRange.colCount === 0 && targetRange.colCount !== 0) {
    return false;
  }
  if (sourceRange.rowCount === 0 && targetRange.rowCount !== 0) {
    return false;
  }
  if (targetRange.colCount === 0 && targetRange.row === sourceRange.row) {
    return true;
  }
  if (targetRange.rowCount === 0 && targetRange.col === sourceRange.col) {
    return true;
  }
  const { row, col } = sourceRange;
  const check =
    row >= targetRange.row &&
    row < targetRange.row + targetRange.rowCount &&
    col >= targetRange.col &&
    col < targetRange.col + targetRange.colCount;
  if (check) {
    return true;
  }

  return false;
}

export class SheetRange implements IRange {
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
  static makeRange(range: IRange): SheetRange {
    return new SheetRange(
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

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

export function toIRange(range:IRange) {
  return SheetRange.makeRange(range).toIRange()
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

export function iterateRange(
  range: IRange,
  sheetRowCount: number,
  sheetColCount: number,
  fn: (row: number, col: number) => boolean,
) {
  const { row, col, rowCount, colCount } = range;
  if (isSheet(range)) {
    for (let r = 0; r < sheetRowCount; r++) {
      for (let c = 0; c < sheetColCount; c++) {
        if (fn(r, c)) {
          return;
        }
      }
    }
    return;
  }
  if (isRow(range)) {
    for (let i = 0; i < sheetColCount; i++) {
      if (fn(row, i)) {
        return;
      }
    }
    return;
  }
  if (isCol(range)) {
    for (let i = 0; i < sheetRowCount; i++) {
      if (fn(i, col)) {
        return;
      }
    }
    return;
  }

  const endRow = row + rowCount;
  const endCol = col + colCount;
  for (let r = row; r < endRow; r++) {
    for (let c = col; c < endCol; c++) {
      if (fn(r, c)) {
        return;
      }
    }
  }
}

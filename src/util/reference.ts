import { columnNameToInt, rowLabelToInt, intToColumnName } from './convert';
import { IRange, ReferenceType } from '@/types';
import { SheetRange } from './range';
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from './constant';

const isCharacter = (char: string) =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
const isNum = (char: string) => char >= '0' && char <= '9';

function convertSheetNameToSheetId(value: string) {
  return value;
}

function parseCell(
  ref: string,
  convertSheetName: typeof convertSheetNameToSheetId,
): SheetRange | null {
  if (!ref) {
    return null;
  }
  const realRef = ref.trim();
  let [sheetName, other = ''] = realRef.split('!');
  if (!realRef.includes('!')) {
    sheetName = '';
    other = realRef;
  }
  let i = 0;
  let rowText = '';
  let colText = '';
  if (other[i] === '$') {
    i++;
  }
  while (isCharacter(other[i])) {
    colText += other[i++];
  }
  if (other[i] === '$') {
    i++;
  }
  while (isNum(other[i])) {
    rowText += other[i++];
  }
  if (i !== other.length) {
    return null;
  }
  if (!rowText && !colText) {
    return null;
  }

  let rowCount = 1;
  let colCount = 1;
  let row = 0;
  let col = 0;
  if (rowText === '') {
    colCount = 0;
    rowCount = DEFAULT_ROW_COUNT;
  } else {
    row = rowLabelToInt(rowText);
  }
  if (colText === '') {
    colCount = DEFAULT_COL_COUNT;
    rowCount = 0;
  } else {
    col = columnNameToInt(colText);
  }
  if (row < 0 || col < 0) {
    return null;
  }
  const range = new SheetRange(
    row,
    col,
    rowCount,
    colCount,
    convertSheetName(sheetName),
  );
  return range;
}

export function parseReference(
  text: string,
  convertSheetName = convertSheetNameToSheetId,
): SheetRange | null {
  const [cell1, cell2] = text.split(':');
  const startCell = parseCell(cell1, convertSheetName);
  if (!startCell) {
    return null;
  }
  const endCell = parseCell(cell2, convertSheetName);
  if (!endCell) {
    return startCell;
  }
  endCell.sheetId = startCell.sheetId;
  return mergeRange(startCell, endCell);
}

export function mergeRange(
  start: SheetRange,
  end: SheetRange,
): SheetRange | null {
  if (start.sheetId !== end.sheetId) {
    return null;
  }
  if (
    start.row === end.row &&
    start.col === end.col &&
    start.rowCount === end.rowCount &&
    start.colCount === end.colCount
  ) {
    return start;
  }
  if (start.rowCount === 0 && end.rowCount !== 0) {
    return null;
  }
  if (start.rowCount !== 0 && end.rowCount === 0) {
    return null;
  }
  if (start.colCount === 0 && end.colCount !== 0) {
    return null;
  }
  if (start.colCount !== 0 && end.colCount === 0) {
    return null;
  }

  const rowCount = Math.abs(start.row - end.row) + 1;
  const colCount = Math.abs(start.col - end.col) + 1;
  const row = start.row < end.row ? start.row : end.row;
  const col = start.col < end.col ? start.col : end.col;

  return new SheetRange(row, col, rowCount, colCount, start.sheetId);
}

function convertCell(row: number, col: number, referenceType: ReferenceType) {
  const first = referenceType === 'absolute' || referenceType === 'mixed';
  const second = referenceType === 'absolute';
  return `${first ? '$' : ''}${intToColumnName(col)}${second ? '$' : ''}${
    row + 1
  }`;
}

export function convertToReference(
  range: IRange,
  referenceType: ReferenceType = 'relative',
  convertSheetIdToSheetName = convertSheetNameToSheetId,
) {
  let result = convertCell(range.row, range.col, referenceType);
  let sheetName = convertSheetIdToSheetName(range.sheetId);
  sheetName = sheetName ? `${sheetName}!` : '';
  if (range.colCount > 1 && range.rowCount > 1) {
    const end = convertCell(
      range.row + range.rowCount - 1,
      range.col + range.colCount - 1,
      referenceType,
    );
    result = `${result}:${end}`;
  }
  return sheetName + result;
}

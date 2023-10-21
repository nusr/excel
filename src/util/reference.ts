import { columnNameToInt, rowLabelToInt, intToColumnName } from './convert';
import { IRange, ReferenceType } from '@/types';
import { Range } from './range';
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from './constant';

const isCharacter = (char: string) =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
const isNum = (char: string) => char >= '0' && char <= '9';

function convertSheetNameToSheetId(value: string) {
  return value;
}

export function parseCell(
  ref: string,
  convertSheetName = convertSheetNameToSheetId,
): Range | null {
  if (typeof ref !== 'string' || !ref) {
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
  if (row === -1 || col === -1) {
    return null;
  }
  const range = new Range(
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
): Range | null {
  const [cell1, cell2] = text.split(':');
  const startCell = parseCell(cell1, convertSheetName);
  if (!startCell) {
    return null;
  }
  const endCell = parseCell(cell2, convertSheetName);
  if (!endCell) {
    return startCell;
  }
  const rowCount = endCell.row - startCell.row + 1;
  const colCount = endCell.col - startCell.col + 1;
  return new Range(
    startCell.row,
    startCell.col,
    rowCount,
    colCount,
    endCell.sheetId,
  );
}

export function mergeRange(start: Range, end: Range): Range | null {
  if (start.sheetId !== end.sheetId) {
    return null;
  }
  const rowCount = Math.abs(start.row - end.row) + 1;
  const colCount = Math.abs(start.col - end.col) + 1;
  const row = start.row < end.row ? start.row : end.row;
  const col = start.col < end.col ? start.col : end.col;

  return new Range(row, col, rowCount, colCount, start.sheetId);
}

function convertCell(row: number, col: number, referenceType: ReferenceType) {
  const first = referenceType === 'absolute';
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
      range.row + range.rowCount,
      range.col + range.colCount,
      referenceType,
    );
    result = `${result}:${end}`;
  }
  return sheetName + result;
}

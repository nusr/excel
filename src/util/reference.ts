import { columnNameToInt, rowLabelToInt, intToColumnName } from './convert';
import { IRange, ReferenceType } from '../types';
import { SheetRange } from './range';
import { XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from './constant';

export const isAlpha = (char: string) =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
export const isDigit = (char: string) => char >= '0' && char <= '9';

function convertSheetNameToSheetId(value: string) {
  return value;
}

function parseCell(
  ref: string,
  convertSheetName: typeof convertSheetNameToSheetId,
): SheetRange | undefined {
  if (!ref) {
    return undefined;
  }
  const realRef = ref.trim();
  let [sheetName, other = ''] = realRef.split('!');
  if (!realRef.includes('!')) {
    sheetName = '';
    other = realRef;
  }
  if (
    sheetName &&
    sheetName[0] === "'" &&
    sheetName[sheetName.length - 1] === "'"
  ) {
    sheetName = sheetName.slice(1, -1);
  }
  let i = 0;
  let rowText = '';
  let colText = '';
  if (other[i] === '$') {
    i++;
  }
  while (i < other.length && isAlpha(other[i])) {
    colText += other[i++];
  }
  if (other[i] === '$') {
    i++;
  }
  while (i < other.length && isDigit(other[i])) {
    rowText += other[i++];
  }
  if (i !== other.length) {
    return undefined;
  }
  if (!rowText && !colText) {
    return undefined;
  }

  let rowCount = 1;
  let colCount = 1;
  let row = -1;
  let col = -1;
  if (rowText === '') {
    rowCount = 0;
    row = 0;
  } else {
    row = rowLabelToInt(rowText);
  }
  if (colText === '') {
    colCount = 0;
    col = 0;
  } else {
    col = columnNameToInt(colText);
  }
  if (
    row < 0 ||
    col < 0 ||
    col >= XLSX_MAX_COL_COUNT ||
    row >= XLSX_MAX_ROW_COUNT
  ) {
    return undefined;
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
): SheetRange | undefined {
  const [cell1 = '', cell2 = ''] = text?.split(':') || [];
  const startCell = parseCell(cell1, convertSheetName);
  if (!startCell) {
    return undefined;
  }
  const endCell = parseCell(cell2, convertSheetName);
  if (!endCell) {
    return startCell;
  }
  endCell.sheetId = startCell.sheetId;
  return mergeRange(startCell, endCell);
}

export function mergeRange(start: IRange, end: IRange): SheetRange | undefined {
  if (start.sheetId !== end.sheetId) {
    return undefined;
  }
  if (
    start.row === end.row &&
    start.col === end.col &&
    start.rowCount === end.rowCount &&
    start.colCount === end.colCount
  ) {
    return SheetRange.makeRange(start);
  }
  if (start.rowCount === 0 && end.rowCount !== 0) {
    return undefined;
  }
  if (start.rowCount !== 0 && end.rowCount === 0) {
    return undefined;
  }
  if (start.colCount === 0 && end.colCount !== 0) {
    return undefined;
  }
  if (start.colCount !== 0 && end.colCount === 0) {
    return undefined;
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

export const R1C1_REG = /^R(\[-\d+\]|\[\d+\]|\d+)?C(\[-\d+\]|\[\d+\]|\d+)?$/i;

function parseNumber(text: string, num: number) {
  let result = -1;
  if (text.startsWith('[')) {
    const t = parseInt(text.slice(1, -1), 10);
    if (!isNaN(t)) {
      result = num + t;
    }
  } else {
    const t = parseInt(text, 10);
    if (!isNaN(t)) {
      result = t - 1;
    }
  }
  return isNaN(result) ? -1 : result;
}

export function parseR1C1(
  name: string,
  activeCell: Pick<IRange, 'sheetId' | 'row' | 'col'> = {
    row: -1,
    col: -1,
    sheetId: '',
  },
): SheetRange | undefined {
  const text = name.toUpperCase();
  if (text[0] !== 'R') {
    return undefined;
  }
  const list = text.slice(1).split('C');
  if (list.length !== 2) {
    return undefined;
  }
  const [rowText, colText] = list;
  let row = -1;
  let col = -1;
  if (!rowText) {
    row = activeCell.row;
  } else {
    row = parseNumber(rowText, activeCell.row);
  }
  if (!colText) {
    col = activeCell.col;
  } else {
    col = parseNumber(colText, activeCell.col);
  }
  if (
    col >= XLSX_MAX_COL_COUNT ||
    row >= XLSX_MAX_ROW_COUNT ||
    row < 0 ||
    col < 0
  ) {
    return undefined;
  }
  const range = new SheetRange(row, col, 1, 1, activeCell.sheetId);
  return range;
}

import {
  SHEET_NAME_PREFIX,
  SPLITTER,
  FORMULA_PREFIX,
  MERGE_CELL_LINE_BREAK,
  DEFAULT_EXCEL_ID
} from './constant';
import type {
  WorksheetType,
  Coordinate,
  ModelJSON,
  ResultType,
  IRange,
} from '../types';

export function parseNumber(value: any): [boolean, number] {
  if (typeof value === 'boolean') {
    return [true, Number(value)];
  }
  if (typeof value === 'number' && !isNaN(value)) {
    return [true, value];
  }
  if (typeof value !== 'string') {
    return [false, 0];
  }
  if (value.length > 12) {
    return [false, 0];
  }
  const temp = Number(value);
  if (isNaN(temp)) {
    return [false, 0];
  }
  return [true, temp];
}

export function getListMaxNum(list: string[] = []): number {
  const idList: number[] = list
    .map((item) => {
      return parseNumber(item)[1];
    })
    .filter((v) => !isNaN(v));
  return Math.max(Math.max(...idList), 0);
}

export function getDefaultSheetInfo(
  list: WorksheetType[] = [],
): Pick<WorksheetType, 'name' | 'sheetId' | 'sort'> {
  const sheetId =
    Math.ceil(getListMaxNum(list.map((item) => item.sheetId))) + 1;
  return {
    name: `${SHEET_NAME_PREFIX}${sheetId}`,
    sheetId: String(sheetId),
    sort: sheetId,
  };
}

export function convertStringToResultType(value: any): ResultType {
  if (typeof value === 'string') {
    const temp = value.toUpperCase();
    if (['TRUE', 'FALSE'].includes(temp)) {
      return temp === 'TRUE';
    }
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === '') {
    return '';
  }
  const [check, num] = parseNumber(value);
  if (check) {
    return num;
  }
  return value;
}

export function coordinateToString(
  row: number,
  col: number,
): `${number}_${number}` {
  return `${row}${SPLITTER}${col}`;
}

export function stringToCoordinate(key: string): Coordinate {
  const [row, col] = key.split(SPLITTER);
  const r = parseInt(row, 10);
  const c = parseInt(col, 10);
  return {
    row: isNaN(r) ? -1 : r,
    col: isNaN(c) ? -1 : c,
  };
}

export function getWorksheetKey(sheetId: string, row: number, col: number) {
  return `${sheetId}${SPLITTER}${row}${SPLITTER}${col}`;
}

export function convertWorksheetKey(
  key: string,
): Pick<IRange, 'sheetId' | 'row' | 'col'> | null {
  const [sheetId, row, col] = key.split(SPLITTER);
  const r = parseInt(row, 10);
  const c = parseInt(col, 10);
  const result: Pick<IRange, 'sheetId' | 'row' | 'col'> = {
    row: isNaN(r) ? -1 : r,
    col: isNaN(c) ? -1 : c,
    sheetId,
  };
  if (result.row < 0 || result.col < 0 || !sheetId) {
    return null;
  }
  return result;
}

export function getCustomWidthOrHeightKey(
  sheetId: string,
  rowOrCol: number,
): `${string}_${number}` {
  return `${sheetId}${SPLITTER}${rowOrCol}`;
}

export function widthOrHeightKeyToData(key: string) {
  const [sheetId, num] = key.split(SPLITTER);
  const r = parseInt(num, 10);
  return {
    sheetId,
    rowOrCol: isNaN(r) ? -1 : r,
  };
}

export function generateUUID() {
  let d = new Date().getTime();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );

  return uuid;
}

export function isMobile() {
  const matchList = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  const ua = navigator.userAgent;
  return matchList.some((v) => ua.match(v));
}

export const KEY_LIST: Array<keyof ModelJSON> = [
  'autoFilter',
  'currentSheetId',
  'customHeight',
  'customWidth',
  'workbook',
  'worksheets',
  'definedNames',
  'drawings',
  'mergeCells',
  'rangeMap',
  'scroll',
] as const;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isTestEnv(): boolean {
  return process.env.NODE_ENV === 'test';
}

export function isMac() {
  return navigator?.userAgent?.indexOf('Mac OS X') >= 0;
}

export function isFormula(value: ResultType) {
  if (
    typeof value === 'string' &&
    value &&
    value.startsWith(FORMULA_PREFIX) &&
    value.length > 1
  ) {
    return true;
  }
  return false;
}

export function isMergeContent(isMergeCell: boolean, text: string) {
  return isMergeCell && text.includes(MERGE_CELL_LINE_BREAK);
}

export function isInIframe() {
  return window?.top !== window;
}

export function getDocId() {
  const docId =
    (window?.top?.location?.hash || '').slice(1) ||
    window.location.hash.slice(1) ||
    import.meta.env.VITE_DEFAULT_EXCEL_ID ||
    DEFAULT_EXCEL_ID;
  return docId;
}
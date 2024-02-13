import { SHEET_NAME_PREFIX, SPLITTER, WORK_SHEETS_PREFIX } from './constant';
import type { WorksheetType, ResultType, Coordinate } from '@/types';

export function isNumber(value: any): boolean {
  if (typeof value === 'number' && !window.isNaN(value)) {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  const temp = parseFloat(value);
  return !window.isNaN(temp);
}

export function parseNumber(value: any): number {
  if (isNumber(value)) {
    return Number(value);
  }
  return 0;
}

export function parseNumberArray(list: any[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < list.length; i++) {
    const temp = parseNumber(list[i]);
    if (!window.isNaN(temp)) {
      result.push(temp);
    }
  }
  return result;
}

export function getListMaxNum(list: string[] = []): number {
  const idList: number[] = list
    .map((item) => {
      if (isNumber(item)) {
        return parseInt(item, 10);
      }
      return 0;
    })
    .filter((v) => !isNaN(v));
  return Math.max(Math.max(...idList), 0);
}

export function getDefaultSheetInfo(
  list: WorksheetType[] = [],
): Pick<WorksheetType, 'name' | 'sheetId'> {
  const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
  return {
    name: `${SHEET_NAME_PREFIX}${sheetId}`,
    sheetId: String(sheetId),
  };
}

export function splitToWords(str: string): string[] {
  // unicode
  // graphemer
  const list = new Intl.Segmenter().segment(str);
  return [...list].map((x) => x.segment);
}

export function convertResultTypeToString(value: ResultType): string {
  let text = String(value);
  if (
    typeof value === 'boolean' ||
    ['TRUE', 'FALSE'].includes(text.toUpperCase())
  ) {
    text = text.toUpperCase();
  } else if (value === undefined || value === null) {
    text = '';
  }
  return text;
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
    row: isNaN(r) ? 0 : r,
    col: isNaN(c) ? 0 : c,
  };
}
export function getWorkSheetKey(sheetId: string): `worksheets_${string}` {
  return `${WORK_SHEETS_PREFIX}${sheetId}`;
}

export function getCustomWidthOrHeightKey(
  sheetId: string,
  rowOrCol: number,
): `${string}_${number}` {
  return `${sheetId}${SPLITTER}${rowOrCol}`;
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

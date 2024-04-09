import { SHEET_NAME_PREFIX, SPLITTER } from './constant';
import type {
  WorksheetType,
  ChangeEventType,
  Coordinate,
  ICommandItem,
  ResultType,
} from '@/types';

export function isNumber(value: any): boolean {
  if (typeof value === 'number' && !window.isNaN(value)) {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  if (!value) {
    return false;
  }
  const temp = Number(value);
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
    const temp = Number(list[i]);
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
): Pick<WorksheetType, 'name' | 'sheetId' | 'sort'> {
  const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
  return {
    name: `${SHEET_NAME_PREFIX}${sheetId}`,
    sheetId: String(sheetId),
    sort: sheetId,
  };
}

export function splitToWords(str: string): string[] {
  if (!str) {
    return [];
  }
  // unicode
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
    // firefox
    return [...str];
  }
  const list = new Intl.Segmenter([], { granularity: 'word' }).segment(str);
  const arr = [...list];
  return arr.map((x) => x.segment);
}

export function convertResultTypeToString(value: any): string {
  if (typeof value === 'string') {
    if (['TRUE', 'FALSE'].includes(value.toUpperCase())) {
      return value.toUpperCase();
    }
    return value;
  }
  if (typeof value === 'number') {
    return '' + value;
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  return '';
}

export function convertStringToResultType(value: any): ResultType {
  if (isNumber(value)) {
    return Number(value);
  }
  if (typeof value === 'string') {
    const temp = value.toUpperCase();
    if (['TRUE', 'FALSE'].includes(temp)) {
      return temp === 'TRUE';
    }
  }
  if (typeof value === 'boolean') {
    return value;
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

export function modelToChangeSet(list: ICommandItem[]) {
  const result = new Set<ChangeEventType>();
  for (const item of list) {
    const type = item.type;
    result.add(type);
    if (type === 'worksheets') {
      if (item.key.includes('style')) {
        result.add('cellStyle');
      } else {
        result.add('cellValue');
      }
    } else if (type === 'workbook') {
      if (item.key.includes('rowCount')) {
        result.add('row');
      }
      if (item.key.includes('colCount')) {
        result.add('col');
      }
    } else if (type === 'customHeight') {
      result.add('row');
    } else if (type === 'customWidth') {
      result.add('col');
    }
  }
  return result;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

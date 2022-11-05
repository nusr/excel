import { SHEET_NAME_PREFIX } from './constant';
import type { WorksheetType, ResultType } from '@/types';
export const isString = (value: ResultType): boolean => {
  return typeof value === 'string';
};
export function isNumber(value: ResultType): boolean {
  if (typeof value === 'number' && !window.isNaN(value)) {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  const temp = parseFloat(value);
  return !window.isNaN(temp) && temp === Number(value);
}

export function parseNumber(value: ResultType): number {
  if (isNumber(value)) {
    return Number(value);
  }
  return 0;
}

export function parseNumberArray(list: ResultType[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < list.length; i++) {
    const temp = parseNumber(list[i]);
    if (!window.isNaN(temp)) {
      result.push(temp);
    }
  }
  return result;
}

export function getListMaxNum(list: string[] = [], prefix = ''): number {
  const idList: number[] = list
    .map((item) => {
      if (isNumber(item) || prefix.length === 0) {
        return parseInt(item, 10);
      }
      return parseInt(
        item.includes(prefix) ? item.slice(prefix.length) : item,
        10,
      );
    })
    .filter((v) => !isNaN(v));
  return Math.max(Math.max(...idList), 0);
}

export function getDefaultSheetInfo(
  list: WorksheetType[] = [],
): Pick<WorksheetType, 'name' | 'sheetId'> {
  const sheetNum = getListMaxNum(
    list.map((item) => item.name),
    SHEET_NAME_PREFIX,
  );
  const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
  return {
    name: `${SHEET_NAME_PREFIX}${sheetNum + 1}`,
    sheetId: String(sheetId),
  };
}

export function isTestEnv(): boolean {
  return process.env.NODE_ENV === 'test';
}

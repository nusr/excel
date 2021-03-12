import { SHEET_NAME_PREFIX } from "./constant";
import type { WorksheetType } from "@/types";
import { isNil } from "@/lodash";
export function isNumber(value: string | number): boolean {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parseFloat(value) == value;
}

export function parseNumber(value?: string | number): number {
  if (isNil(value)) {
    return window.NaN;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return value.includes(".") ? parseFloat(value) : parseInt(value);
  }
  return window.NaN;
}

export function getListMaxNum(list: string[] = [], prefix = ""): number {
  const idList: number[] = list
    .map((item) => {
      if (isNumber(item) || prefix.length === 0) {
        return parseInt(item, 10);
      }
      return parseInt(item.slice(prefix.length), 10);
    })
    .filter((v) => !isNaN(v));
  return Math.max(Math.max(...idList), 0);
}

export function getDefaultSheetInfo(list: WorksheetType[] = []): WorksheetType {
  const sheetNum = getListMaxNum(
    list.map((item) => item.name),
    SHEET_NAME_PREFIX
  );
  const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
  return {
    name: `${SHEET_NAME_PREFIX}${sheetNum + 1}`,
    sheetId: String(sheetId),
    rowCount: 30,
    colCount: 30,
  };
}

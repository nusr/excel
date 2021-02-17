import { START_SHEET_ID, SHEET_NAME_PREFIX } from "./constant";
import type { WorksheetType } from "@/types";
export function isNumber(value: string | number): boolean {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parseFloat(value) == value;
}
export function isNil(value?: unknown): boolean {
  return value === null || value === undefined;
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

export function getSheetNameNum(list: WorksheetType[] = []): number {
  const numList = list
    .map((item) => item.name)
    .filter((item) => /^Sheet/gm.test(item))
    .map((item) => {
      console.log(item);
      const temp = item.replace(SHEET_NAME_PREFIX, "");
      return parseInt(temp, 10);
    })
    .filter((v) => !isNaN(v));
  const sheetNameTag =
    numList.length > 0 ? Math.max.apply(null, numList) + 1 : START_SHEET_ID;
  return sheetNameTag;
}
export function getSheetId(
  list: WorksheetType[] = [],
  sheetNameNum: number = START_SHEET_ID
): number {
  const idList = list
    .map((item) => {
      const id = item.sheetId;
      return parseInt(id, 10);
    })
    .filter((v) => !isNaN(v));
  let sheetId = sheetNameNum;
  while (idList.includes(sheetId)) {
    sheetId++;
  }
  return sheetId;
}

export function getDefaultSheetInfo(list: WorksheetType[] = []): WorksheetType {
  const sheetNameNum = getSheetNameNum(list);
  const sheetId = getSheetId(list, sheetNameNum);
  return {
    name: `${SHEET_NAME_PREFIX}${sheetNameNum}`,
    sheetId: String(sheetId),
    rowCount: 30,
    colCount: 30,
  };
}

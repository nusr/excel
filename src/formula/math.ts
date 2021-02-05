// import { isNil } from "lodash-es";
function isNil(value: unknown): boolean {
  return value === null || value === undefined;
}
function parseNumber(value: string): number {
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

export function SUM(...rest: string[]): number {
  if (rest.length === 0) {
    throw new Error("error params");
  }
  if (rest.length === 1) {
    const temp = parseNumber(rest[0]);
    if (isNaN(temp)) {
      throw new Error("error params");
    }
    return temp;
  }
  let result = undefined;
  for (const item of rest) {
    const temp = parseNumber(item);
    if (!isNaN(temp)) {
      if (result === undefined) {
        result = 0;
      }
      result += temp;
    }
  }
  if (result === undefined) {
    throw new Error("error params");
  }
  return result;
}

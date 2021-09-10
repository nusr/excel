import { parseNumber, parseNumberArray } from "@/util";
import type { ResultType } from "../types";
export const ABS = (data: ResultType): number => {
  return Math.abs(parseNumber(data));
};
export const ACOS = (data: ResultType): number => {
  return Math.acos(parseNumber(data));
};

export const ACOSH = (data: ResultType): number => {
  const temp = parseNumber(data);
  return Math.log(temp + Math.sqrt(temp * temp - 1));
};

export const ACOT = (data: ResultType): number => {
  return Math.atan(1 / parseNumber(data));
};

export const ACOTH = (data: ResultType): number => {
  const temp = parseNumber(data);
  return 0.5 * Math.log((temp + 1) / (temp - 1));
};
export const ASIN = (data: ResultType): number => {
  return Math.asin(parseNumber(data));
};
export const SUM = (...rest: Array<ResultType>): number => {
  const list = parseNumberArray(rest);
  return list.reduce((sum, cur) => sum + cur, 0);
};

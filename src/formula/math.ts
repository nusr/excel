import { parseNumberArray, throwError } from "@/util";
import type { ResultType } from "../types";
export const ABS = (data: ResultType): number => {
  throwError(typeof data === "number", "#VALUE!");
  return Math.abs(data);
};
export const ACOS = (data: ResultType): number => {
  throwError(typeof data === "number", "#VALUE!");
  return Math.acos(data);
};

export const ACOSH = (data: ResultType): number => {
  throwError(typeof data === "number", "#VALUE!");
  return Math.log(data + Math.sqrt(data * data - 1));
};

export const ACOT = (data: ResultType): number => {
  throwError(typeof data === "number", "#VALUE!");
  return Math.atan(1 / data);
};

export const ACOTH = (data: ResultType): number => {
  throwError(typeof data === "number", "#VALUE!");
  return 0.5 * Math.log((data + 1) / (data - 1));
};
export const ASIN = (data: ResultType): number => {
  throwError(typeof data === "number", "#VALUE!");
  return Math.asin(data);
};
export const SUM = (...rest: Array<ResultType>): number => {
  const list = parseNumberArray(rest);
  return list.reduce((sum, cur) => sum + cur, 0);
};

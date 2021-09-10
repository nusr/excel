import type { ErrorTypes } from "../types";
const FORMULA_ERRORS: ErrorTypes[] = [
  "#ERROR!",
  "#DIV/0!",
  "#NAME?",
  "#N/A",
  "#NULL!",
  "#NUM!",
  "#REF!",
  "#VALUE!",
];
export function throwError(
  condition: boolean,
  type: ErrorTypes
): asserts condition {
  if (!condition) {
    throw new Error(type);
  }
}
export function parseError(type: string): ErrorTypes | null {
  if (FORMULA_ERRORS.some((item) => item === type)) {
    return type as ErrorTypes;
  }
  return null;
}

interface IFormulaOptions {
  paramsType: "number" | "string" | "any";
  minParamsCount: number;
  maxParamsCount: number;
  resultType: "number" | "string";
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormulaFunction = (...data: any[]) => number | string | boolean;
export type FormulaContent = {
  func: FormulaFunction;
  options: IFormulaOptions;
} | null;

export type TextFormulaKeys =
  | "ASC"
  | "BAHTTEXT"
  | "CLEAN"
  | "CONCATENATE"
  | "DBCS"
  | "DOLLAR"
  | "EXACT"
  | "FIND"
  | "FIXED"
  | "HTML2TEXT"
  | "LEFT"
  | "MID"
  | "NUMBERVALUE"
  | "PRONETIC"
  | "PROPER"
  | "REGEXEXTRACT"
  | "REGEXMATCH"
  | "REGREPLACE"
  | "REPLACE"
  | "REPT"
  | "RIGHT"
  | "SEARCH"
  | "SPLIT"
  | "SUBSTITUTE"
  | "TEXT"
  | "VALUE"
  | "T"
  | "LOWER"
  | "CHAR"
  | "CODE"
  | "LEN"
  | "UNICHAR"
  | "UNICODE"
  | "UPPER"
  | "TRIM";
export type MathFormulaKeys =
  | "ABS"
  | "ACOS"
  | "ACOSH"
  | "ACOT"
  | "ACOTH"
  | "ASIN"
  | "ASINH"
  | "ATAN"
  | "ATANH"
  | "COS"
  | "COT"
  | "COS"
  // | "DECIMAL"
  | "EXP"
  | "INT"
  | "PI"
  | "E"
  | "SIN"
  | "SUM";

export type FormulaKeys = TextFormulaKeys | MathFormulaKeys;

export type TextFormulaType = Record<TextFormulaKeys, FormulaContent>;
export type MathFormulaType = Record<MathFormulaKeys, FormulaContent>;
export type FormulaType = Record<FormulaKeys, FormulaContent>;

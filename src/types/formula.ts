export type FormulaContent = {
  func: (...data: any[]) => number | string | boolean;
  options: {
    paramsType: "number" | "string" | "any";
    minParamsCount: number;
    maxParamsCount: number;
    resultType: "number" | "string";
  };
};

export type TextFormulaKeys =
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

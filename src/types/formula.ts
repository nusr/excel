interface IFormulaOptions {
  paramsType: 'number' | 'string' | 'any';
  minParamsCount: number;
  maxParamsCount: number;
  resultType: 'number' | 'string' | 'array string';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormulaFunction = (...data: any[]) => number | string | boolean | string[];
export type FormulaContent = {
  func: FormulaFunction;
  options: IFormulaOptions;
} | null;

export type TextFormulaKeys =
  | 'CONCATENATE'
  | 'CONCAT'
  | 'SPLIT'
  | 'T'
  | 'LOWER'
  | 'CHAR'
  | 'CODE'
  | 'LEN'
  | 'UNICHAR'
  | 'UNICODE'
  | 'UPPER'
  | 'TRIM';
export type MathFormulaKeys =
  | 'ABS'
  | 'ACOS'
  | 'ACOSH'
  | 'ACOT'
  | 'ACOTH'
  | 'ASIN'
  | 'ASINH'
  | 'ATAN'
  | 'ATANH'
  | 'COS'
  | 'COT'
  | 'COS'
  | 'EXP'
  | 'INT'
  | 'PI'
  | 'E'
  | 'SIN'
  | 'SUM';

export type FormulaKeys = TextFormulaKeys | MathFormulaKeys;

export type TextFormulaType = Record<TextFormulaKeys, FormulaContent>;
export type MathFormulaType = Record<MathFormulaKeys, FormulaContent>;
export type FormulaType = Record<FormulaKeys, FormulaContent>;

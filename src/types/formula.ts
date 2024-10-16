import { ResultType } from './parser';

export type FormulaFunction = (
  ...data: ResultType[]
) => number | string | boolean | string[];

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
  | 'TRIM' 
  | 'TEXT';
  
export type MathFormulaKeys =
  | 'ABS'
  | 'ACOS'
  | 'ACOSH'
  | 'ACOT'
  | 'ACOTH'
  | 'ASIN'
  | 'ASINH'
  | 'ATAN'
  | 'ATAN2'
  | 'ATANH'
  | 'COS'
  | 'COT'
  | 'COS'
  | 'EXP'
  | 'INT'
  | 'PI'
  | 'E'
  | 'SIN'
  | 'SUM'
  | 'AVERAGE';

export type FormulaKeys = TextFormulaKeys | MathFormulaKeys;

export type TextFormulaType = Record<TextFormulaKeys, FormulaFunction>;
export type MathFormulaType = Record<MathFormulaKeys, FormulaFunction>;
export type FormulaType = Record<FormulaKeys, FormulaFunction>;

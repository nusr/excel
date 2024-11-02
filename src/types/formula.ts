import { type ResultType } from './parser';

export type FormulaFunction = (
  ...data: ResultType[]
) => number | string | boolean | string[];
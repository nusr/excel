import { parseNumberArray, MAX_PARAMS_COUNT } from '@/util';
import type { MathFormulaType } from '../../types';
import { assert, mustOneNumber, mustEmpty } from './error';

export const ABS = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.abs(data);
};
export const ACOS = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.acos(data);
};

export const ACOSH = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.log(data + Math.sqrt(data * data - 1));
};

export const ACOT = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.atan(1 / data);
};

export const ACOTH = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return 0.5 * Math.log((data + 1) / (data - 1));
};
export const ASIN = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.asin(data);
};

export const ASINH = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.log(data + Math.sqrt(data * data + 1));
};
export const ATAN = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.atan(data);
};
export const ATAN2 = (...list: any[]): number => {
  assert(list.length === 2);
  const [x, y] = list;
  assert(typeof x === 'number');
  assert(typeof y === 'number');
  return Math.atan2(x, y);
};
export const ATANH = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.log((1 + data) / (data + 1)) / 2;
};

export const COS = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.cos(data);
};
export const COT = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return 1 / Math.tan(data);
};
export const CSC = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return 1 / Math.sin(data);
};
export const DECIMAL = (...list: any[]): number => {
  assert(list.length === 2);
  const [data, radix] = list;
  assert(typeof data === 'string');
  assert(typeof radix === 'number');
  return parseInt(data, radix);
};
export const DEGREES = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return (data * 180) / Math.PI;
};
export const EXP = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.exp(data);
};
export const INT = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.floor(data);
};
export const LN10 = (...list: any[]): number => {
  mustEmpty(list);
  return Math.log(10);
};
export const LN2 = (...list: any[]): number => {
  mustEmpty(list);
  return Math.log(2);
};
export const LOG10E = (...list: any[]): number => {
  mustEmpty(list);
  return Math.LOG10E;
};
export const LOG2E = (...list: any[]): number => {
  mustEmpty(list);
  return Math.LOG2E;
};
export const LOG = (...list: any[]): number => {
  assert(list.length >= 1 && list.length <= 2);
  const [data, base = 10] = list;
  assert(typeof data === 'number');
  assert(typeof base === 'number');
  return Math.log(data) / Math.log(base);
};

export const LOG10 = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.log(data) / Math.log(10);
};
export const PI = (...list: any[]): number => {
  mustEmpty(list);
  return Math.PI;
};
export const E = (...list: any[]): number => {
  mustEmpty(list);
  return Math.E;
};
export const SIN = (...list: any[]): number => {
  const data = mustOneNumber(list);
  return Math.sin(data);
};
export const SUM = (...rest: any[]): number => {
  const list = parseNumberArray(rest);
  assert(list.length <= MAX_PARAMS_COUNT);
  return list.reduce((sum, cur) => sum + cur, 0);
};

const formulas: MathFormulaType = {
  ABS,
  ACOS,
  ACOSH,
  ACOT,
  ACOTH,
  ASIN,
  ASINH,
  ATAN,
  ATAN2,
  ATANH,
  COT,
  COS,
  EXP,
  INT,
  PI,
  E,
  SIN,
  SUM,
};

export default formulas;

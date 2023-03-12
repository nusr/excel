import type { TextFormulaType } from '@/types';
import { MAX_PARAMS_COUNT } from '@/util';
import { assert, mustOneString, mustOneNumber, mustOne } from './error';

export const T = (...list: any[]): string => {
  const value = mustOne(list);
  return typeof value === 'string' ? value : '';
};

export const LOWER = (...list: any[]): string => {
  const value = mustOneString(list);
  return value.toLowerCase();
};
export const CHAR = (...list: any[]): string => {
  const value = mustOneNumber(list);
  return String.fromCharCode(value);
};
export const CODE = (...list: any[]): number => {
  const value = mustOneString(list);
  return value.charCodeAt(0);
};
export const LEN = (...list: any[]): number => {
  const value = mustOneString(list);
  return value.length;
};

export const SPLIT = (...list: any[]): string[] => {
  assert(list.length === 2);
  const [value, sep] = list;
  assert(typeof value === 'string');
  assert(typeof sep === 'string');
  return value.split(sep);
};
export const UPPER = (...list: any[]): string => {
  const value = mustOneString(list);
  return value.toUpperCase();
};
export const TRIM = (...list: any[]): string => {
  const value = mustOneString(list);
  return value.replace(/ +/g, ' ').trim();
};
export const CONCAT = (...list: any[]): string => {
  assert(list.length <= MAX_PARAMS_COUNT);
  return list.join('');
};

const textFormulas: TextFormulaType = {
  CONCAT,
  CONCATENATE: CONCAT,
  SPLIT,
  CHAR,
  CODE,
  UNICHAR: CHAR,
  UNICODE: CODE,
  LEN,
  LOWER,
  UPPER,
  TRIM,
  T,
};

export default textFormulas;

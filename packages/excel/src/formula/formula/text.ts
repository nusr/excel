import { ResultType } from '../../types';
import { MAX_PARAMS_COUNT } from '../../util';
import { assert, mustOneString, mustOneNumber, mustOne } from './error';
import { numberFormat } from '../numberFormat'

export const T = (...list: ResultType[]): string => {
  const value = mustOne(list);
  return typeof value === 'string' ? value : '';
};

export const LOWER = (...list: ResultType[]): string => {
  const value = mustOneString(list);
  return value.toLowerCase();
};
export const CHAR = (...list: ResultType[]): string => {
  const value = mustOneNumber(list);
  return String.fromCharCode(value);
};
export const CODE = (...list: ResultType[]): number => {
  const value = mustOneString(list);
  return value.charCodeAt(0);
};
export const LEN = (...list: ResultType[]): number => {
  const value = mustOneString(list);
  return value.length;
};

export const SPLIT = (...list: ResultType[]): string[] => {
  assert(list.length === 2);
  const [value, sep] = list;
  assert(typeof value === 'string');
  assert(typeof sep === 'string');
  return value.split(sep);
};
export const UPPER = (...list: ResultType[]): string => {
  const value = mustOneString(list);
  return value.toUpperCase();
};
export const TEXT = (...list: ResultType[]): string => {
  assert(list.length === 2);
  const [value, format] = list;
  assert(typeof value === 'string' || typeof value === 'number');
  assert(typeof format === 'string');
  return numberFormat(value, format)
};
export const TRIM = (...list: ResultType[]): string => {
  const value = mustOneString(list);
  return value.replace(/ +/g, ' ').trim();
};
export const CONCAT = (...list: ResultType[]): string => {
  assert(list.length <= MAX_PARAMS_COUNT);
  return list.join('');
};

const formulas = {
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
  TEXT,
  T,
};

export default formulas;

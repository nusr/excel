import { type ErrorTypes, ERROR_SET } from './constant';
import * as formulajs from '@formulajs/formulajs';

export const getFunction = (name: string) => {
  let fun: unknown = formulajs;
  for (const part of name.toUpperCase().replace(/^_XLFN\./, '').replace(/^_XLWS\./, '').split('.')) {
    if (!fun || (typeof fun !== 'object' && typeof fun !== 'function') ||
      !Object.prototype.hasOwnProperty.call(fun, part)) throw getCustomError('#NAME?');
    fun = Reflect.get(fun, part);
  }
  if (typeof fun !== 'function') throw getCustomError('#NAME?');
  return fun;
};

export const getCustomError = (value: ErrorTypes) => {
  const { errors } = formulajs.utils;

  const res: Record<ErrorTypes, Error> = {
    '#GETTING_DATA': errors.data,
    '#DIV/0!': errors.div0,
    '#NULL!': errors.nil,
    '#NUM!': errors.num,
    '#REF!': errors.ref,
    '#VALUE!': errors.value,
    '#N/A': errors.na,
    '#NAME?': errors.name,
  };

  return res[value];
};

export const anyError = (err: unknown) => {
  const message = err instanceof Error ? err.message : typeof err === 'string' || err instanceof String ? String(err) : undefined;
  return [...ERROR_SET].find((value) => value === message);
};

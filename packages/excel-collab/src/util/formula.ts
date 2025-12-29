import { type ErrorTypes, ERROR_SET } from './constant';
import * as formulajs from '@formulajs/formulajs';

export const getFunction = (name: string) => {
  const fun = (formulajs as any)[name];
  if (!fun) {
    throw getCustomError('#NAME?');
  }

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
  let res: ErrorTypes | undefined = undefined;

  if (err instanceof Error && ERROR_SET.has(err.message as ErrorTypes)) {
    res = err.message as ErrorTypes;
  }

  if (err instanceof String && ERROR_SET.has(err as ErrorTypes)) {
    res = err as ErrorTypes;
  }

  return res;
};

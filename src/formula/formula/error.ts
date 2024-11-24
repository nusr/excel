import type { ResultType } from '../../types';
import { parseNumber } from '../../util/util';
import { type ErrorTypes } from '../../util/constant';

export class CustomError extends Error {
  readonly value: ErrorTypes | '#TEXT';
  constructor(value: ErrorTypes | '#TEXT') {
    super(value);
    this.value = value;
  }
}

export function assert(
  condition: boolean,
  message: ErrorTypes = '#VALUE!',
): asserts condition {
  if (!condition) {
    throw new CustomError(message);
  }
}

export function mustOne(list: ResultType[]): ResultType {
  assert(list.length === 1);
  const [value] = list;
  return value;
}

export function mustOneString(list: ResultType[]): string {
  const value = mustOne(list);
  assert(typeof value === 'string');
  return value;
}

export function mustOneNumber(list: ResultType[]): number {
  const value = mustOne(list);
  const [check, num] = parseNumber(value);
  assert(check);
  return num;
}

export function mustEmpty(list: ResultType[]) {
  assert(list.length === 0);
}

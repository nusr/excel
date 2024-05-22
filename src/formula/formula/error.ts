import type { ErrorTypes } from '@/types';
import { parseNumber } from '@/util/util';

export class CustomError extends Error {
  readonly value: ErrorTypes;
  constructor(value: ErrorTypes) {
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

export function mustOne(list: any[]): any {
  assert(list.length === 1);
  const [value] = list;
  return value;
}

export function mustOneString(list: any[]): string {
  const value = mustOne(list);
  assert(typeof value === 'string');
  return value;
}

export function mustOneNumber(list: any[]): number {
  const value = mustOne(list);
  const [check, num] = parseNumber(value);
  assert(check);
  return num;
}

export function mustEmpty(list: any[]) {
  assert(list.length === 0);
}

export function isRelativeReference(value: string) {
  const realValue = value.toUpperCase();
  return /^[A-Z]+\d+$/.test(realValue) || /^[A-Z]+$/.test(realValue);
}


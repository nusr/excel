import type { ErrorTypes } from '@/types'
export class CustomError extends Error {
  readonly value: ErrorTypes;
  constructor(value: ErrorTypes) {
    super(value);
    this.value = value;
  }
}
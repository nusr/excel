import { ResultType } from '@/types';

// Excel uses symmetric arithmetic rounding
export function round(value: ResultType, places: number): any {
  if (typeof value !== 'number') {
    return value;
  }
  if (value < 0) {
    return -round(-value, places);
  }
  if (places) {
    const p = 10 ** places || 1;
    return round(value * p, 0) / p;
  }
  return Math.round(value);
}

import { ResultType } from '@/types';
export type FormatType =
  | 'currency'
  | 'date'
  | 'dateTime'
  | 'error'
  | 'fraction'
  | 'general'
  // | 'grouped'
  | 'number'
  | 'percentage'
  | 'scientific'
  | 'text'
  | 'time';

export function numberFormat(): ResultType {
  return '';
}

export function ExcelDateToJSDate(date: number) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

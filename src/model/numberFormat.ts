import SSF from 'ssf';
import { NumberFormatValue } from '@/types';

type FormatOptions = {
  dateNF?: string;
  date1904?: boolean;
}

export function numberFormat(pattern: string | number, value: NumberFormatValue, options: FormatOptions = {}) {
  return SSF.format(pattern, value, options)
}
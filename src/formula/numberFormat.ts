import * as numberFormatUtil from 'numfmt';
import { type NumberFormatValue } from '../types';
import { DEFAULT_FORMAT_CODE } from '../util';

type Options = Parameters<typeof numberFormatUtil.format>[2];

export function numberFormat(
  value: NumberFormatValue,
  pattern?: string,
  options: Options = {},
) {
  return numberFormatUtil.format(
    pattern ?? DEFAULT_FORMAT_CODE,
    value,
    options,
  );
}

export function isDateFormat(format?: string) {
  if (!format) {
    return false;
  }
  return numberFormatUtil.isDateFormat(format);
}

export const convertDateToNumber = numberFormatUtil.dateToSerial;

import SSF from 'ssf';
import { NumberFormatValue } from '../types';
import { DEFAULT_FORMAT_CODE } from '../util/constant';

type FormatOptions = {
  dateNF?: string;
  date1904?: boolean;
};

export function numberFormat(
  value: NumberFormatValue,
  pattern?: string,
  options: FormatOptions = {},
) {
  return SSF.format(pattern || DEFAULT_FORMAT_CODE, value, options);
}

export function isDateFormat(format?: string) {
  if (!format) {
    return false;
  }
  return SSF.is_date(format);
}

export function convertDateToNumber(v: Date, date1904?: boolean): number {
  const baseDate = new Date(1899, 11, 31, 0, 0, 0);
  const baseDateTime = baseDate.getTime();
  const base1904 = new Date(1900, 2, 1, 0, 0, 0);
  let epoch = v.getTime();
  if (date1904) {
    epoch -= 1461 * 24 * 60 * 60 * 1000;
  } else if (v >= base1904) {
    epoch += 24 * 60 * 60 * 1000;
  }
  const result =
    (epoch -
      (baseDateTime +
        (v.getTimezoneOffset() - baseDate.getTimezoneOffset()) * 60000)) /
    (24 * 60 * 60 * 1000);
  return result
}

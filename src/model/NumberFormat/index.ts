import { NUMBER_FORMAT_LIST, assert, DEFAULT_FORMAT, DEFAULT_DATE_FORMAT } from '@/util';
import { convertDateToNumber } from './formatDate'
import { chooseFormat } from './chooseFormat'
import { NumberFormatValue } from '@/types'
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


type FormatOptions = {
  dateNF?: string;
  date1904?: boolean;
}

export function isGeneral(str: string, index = 0): boolean {
  const text = str.slice(index, index + 7);
  return text === 'General';
}

type OutItem = {
  t: string;
  v: string;
}
function formatNumber(value: number | string, format: string, _options: FormatOptions, _size: number): string {
  const result: OutItem[] = []
  for (let i = 0;i < format.length;) {
    let c = format[i];
    switch (c) {
      case 'G': {
        assert(isGeneral(format, 0));
        result.push({ t: 'G', v: 'General' })
        i += 7;
        break;
      }
      case 'M':
      case 'D':
      case 'Y':
      case 'H':
      case 'S':
      // @ts-ignore
      case 'E':
        c = c.toLowerCase()
      case 'm':
      case 'd':
      case 'y':
      case 'h':
      case 's':
      case 'e':
      case 'g': {
        if (typeof value !== 'number') {
          return ''
        }
        if (value < 0) {
          return ''
        }
      }
    }
  }
  return String(value)
}

function formatGeneral(
  value: NumberFormatValue,
  options: FormatOptions
): string {
  // string
  if (typeof value === 'string') {
    return value;
  }
  // boolean
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }
  if (typeof value === 'number') {
    // integer
    if ((value | 0) === value) {
      return value.toString(10)
    }
    // TODO float
    return value.toPrecision(10);
  }
  if (typeof value === 'undefined') {
    return ''
  }
  if (typeof value === 'object') {
    if (value === null) {
      return ''
    }
    if (value instanceof Date) {
      return numberFormat(DEFAULT_DATE_FORMAT, convertDateToNumber(value, options.date1904), options)
    }
  }

  throw new Error(`unsupported value:${value}`)
}

export function numberFormat(pattern: string | number, value: NumberFormatValue, options: FormatOptions = {}): string {
  let format = '';
  if (typeof pattern === 'string') {
    format = pattern
  } else {
    const item = NUMBER_FORMAT_LIST.find(v => v.id === pattern);
    if (item) {
      format = item.formatCode
    }
  }
  format = format || NUMBER_FORMAT_LIST[DEFAULT_FORMAT].formatCode;
  if (isGeneral(format)) {
    return formatGeneral(value, options)
  }
  if (value instanceof Date) {
    value = convertDateToNumber(value, options.date1904)
  }
  const f = chooseFormat(format, value)
  if (isGeneral(f[1])) {
    return formatGeneral(value, options)
  }
  if (value === true) {
    value = 'TRUE'
  } else if (value === false) {
    value = 'FALSE'
  } else if (value === "" || value === undefined || value === null) {
    return ''
  }
  return formatNumber(value, f[1], options, f[0])
}

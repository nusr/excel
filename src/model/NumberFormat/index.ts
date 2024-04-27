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

function isExponent(char: string) {
  return char === 'E' || char === 'e';
}

export function trimZero(str: string): string {
  const list = [...str];
  const expIndex = list.findIndex(isExponent)
  const end = expIndex >= 0 ? expIndex - 1 : list.length - 1;
  if (list[end] === '0') {
    let count = 1;
    // trim  1.1000 or 1.1000E-10
    for (let i = end - 1;i >= 0;i--) {
      if (list[i] === '0') {
        count++;
      } else {
        break;
      }
    }
    list.splice(end - count + 1, count)
  }
  const newExpIndex = list.findIndex(isExponent)
  if (newExpIndex >= 0) {
    const start = (list[newExpIndex + 1] === '-' || list[newExpIndex + 1] === '+') ? newExpIndex + 2 : newExpIndex + 1;
    if (list[start] === '0') {
      // trim 1.1E-0001
      let count = 0;
      for (let i = start + 1;i < list.length;i++) {
        if (list[i] === '0') {
          count++;
        } else {
          break;
        }
      }
      if (count >= 1) {
        list.splice(start, count)
      }
    } else if (start === list.length - 1) {
      // convert 1.1E-7 to 1.1E-07
      list.splice(start, 0, '0')
    }
  }

  if (list[list.length - 1] === '.') {
    list.pop()
  }
  if (list.length >= 3 && list[1] === '.' && (isExponent(list[2]))) {
    list.splice(1, 1)
  }

  return list.join('')
}


function formatFloat(value: number): string {
  let res = ''
  const maxSize = value < 0 ? 12 : 11;
  const exp = Math.floor(Math.log(Math.abs(value)) * Math.LOG10E);
  if (exp >= -4 && exp <= -1) {
    res = value.toPrecision(exp + 10);
  } else if (Math.abs(exp) <= 9) {
    let t = trimZero(value.toFixed(12));
    if (t.length <= maxSize) {
      res = t;
    } else {
      t = value.toPrecision(10);
      if (t.length <= maxSize) {
        res = t;
      } else {
        res = value.toExponential(5)
      }
    }
  } else if (exp === 10) {
    res = value.toFixed(10).slice(0, 12)
  } else {
    const t = trimZero(value.toFixed(11));
    if (t.length > maxSize || t === '0' || t === '-0') {
      res = value.toPrecision(6)
    } else {
      res = t;
    }
  }
  return trimZero(res).toUpperCase()
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
    return formatFloat(value);
  }
  if (typeof value === 'undefined') {
    return ''
  }
  if (typeof value === 'object') {
    if (value === null) {
      return ''
    }
    if (value instanceof Date) {
      const date = convertDateToNumber(value, options.date1904);
      return numberFormat(DEFAULT_DATE_FORMAT, date, options)
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

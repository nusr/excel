import { NUMBER_FORMAT_LIST, assert, TEXT_FORMAT } from '@/util';
import { NumberFormatValue } from '@/types'

function splitFormat(format: string): string[] {
  const result: string[] = []
  let check = false;
  let j = 0;
  for (let i = 0;i < format.length;i++) {
    const c = format[i];
    if (c === '"') {
      check = !check
    } else if (c === '_' || c === '*' || c === '\\') {
      ++i;
    } else if (c === ';') {
      result.push(format.slice(j, i))
      j = i + 1;
    }
  }
  result.push(format.slice(j))
  assert(!check, 'unterminated string')
  return result;
}
const conditionRegex = /\[[=<>]/;
const conditionRegex2 = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;

function checkCondition(v: number, rr: string[] | null) {
  if (rr === null) {
    return false;
  }
  const operand = parseFloat(rr[2]);
  if (!rr[1] || isNaN(operand)) {
    return false;
  }
  switch (rr[1]) {
    case '=': {
      if (v === operand) {
        return true;
      }
      break;
    }
    case '>': {
      if (v > operand) {
        return true;
      }
      break;
    }
    case '<': {
      if (v < operand) {
        return true;
      }
      break;
    }
    case '<>': {
      if (v !== operand) {
        return true;
      }
      break;
    }
    case '>=': {
      if (v >= operand) {
        return true;
      }
      break;
    }
    case '<=': {
      if (v <= operand) {
        return true;
      }
      break;
    }
  }
  return false;
}
export function chooseFormat(pattern: string, value: NumberFormatValue): [number, string] {
  let list = splitFormat(pattern);
  let len = list.length;
  const last = list[len - 1].indexOf(TEXT_FORMAT);
  if (len < 4 && last >= 0) {
    --len;
  }
  assert(list.length <= 4);
  if (typeof value !== 'number') {
    return [4, list.length === 4 || last >= 0 ? list[list.length - 1] : TEXT_FORMAT]
  }
  const general = NUMBER_FORMAT_LIST[0].formatCode;
  if (list.length === 1) {
    list = [general, general, general, list[0]]
  } else if (list.length === 2) {
    list = last >= 0 ? [list[0], list[0], list[0], list[1]] : [list[0], list[1], list[0], TEXT_FORMAT]
  } else if (list.length === 3) {
    list = last >= 0 ? [list[0], list[1], list[0], list[2]] : [list[0], list[1], list[2], TEXT_FORMAT]
  }
  const t = value > 0 ? list[0] : value < 0 ? list[1] : list[2];
  if (list[0].indexOf('[') < 0 && list[0].indexOf(']') < 0) {
    return [len, t]
  }
  if (list[0].match(conditionRegex) !== null || list[1].match(conditionRegex) !== null) {
    const m1 = list[0].match(conditionRegex2)
    if (checkCondition(value, m1)) {
      return [len, list[0]]
    }
    const m2 = list[1].match(conditionRegex2)
    if (checkCondition(value, m2)) {
      return [len, list[1]]
    }
    const index = m1 !== null && m2 !== null ? 2 : 1;
    return [len, list[index]]
  }

  return [len, t]
}

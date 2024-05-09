import { ResultType, ErrorTypes } from '@/types';
import { parseFormula } from '../..';
import { ERROR_SET } from '@/util';

export function expectResult(
  str: string,
  expected: ResultType,
  expressionStr: string = '',
) {
  const result = parseFormula(str);
  expect(result).toEqual({
    isError: ERROR_SET.has(result.result as ErrorTypes),
    result: expected,
    expressionStr,
  });
}

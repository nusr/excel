import { ResultType } from '@/types';
import { parseFormula } from '../..';
import { errorSet } from '../../parser';

export function expectResult(
  str: string,
  expected: ResultType,
  expressionStr: string = '',
) {
  const result = parseFormula(str);
  expect(result).toEqual({
    isError: errorSet.has(result.result as any),
    result: expected,
    expressionStr,
  });
}

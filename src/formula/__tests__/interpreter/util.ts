import { Coordinate, ResultType } from '@/types';
import { parseFormula, CellDataMapImpl } from '../..';
import { isText } from '@/util';

export function expectFormula(
  str: string,
  expected: ResultType[],
  coord: Coordinate = { row: 0, col: 0 },
  cellDataMap = new CellDataMapImpl(),
) {
  const result = parseFormula(str, coord, cellDataMap);
  expect(result.result).toEqual(expected);
}

export function expectText(
  str: string,
  coord: Coordinate = { row: 0, col: 0 },
  cellDataMap = new CellDataMapImpl(),
) {
  const result = parseFormula(str, coord, cellDataMap);
  expect(isText(result.result)).toEqual(true);
}

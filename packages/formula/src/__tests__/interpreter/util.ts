import { Coordinate, ResultType } from '@excel/shared';
import { parseFormula, CellDataMapImpl } from '../../eval';

export function expectFormula(
  str: string,
  expected: ResultType[],
  coord: Coordinate = { row: 0, col: 0 },
  cellDataMap = new CellDataMapImpl(),
) {
  const result = parseFormula(str, coord, cellDataMap);
  expect(result.result).toEqual(expected);
}

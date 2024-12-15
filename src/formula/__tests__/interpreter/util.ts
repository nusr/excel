import { IRange, ResultType } from '../../../types';
import { parseFormula, CellDataMapImpl } from '../../eval';

export function expectFormula(
  str: string,
  expected: ResultType[],
  coord: Pick<IRange, 'sheetId' | 'row' | 'col'> = {
    row: 0,
    col: 0,
    sheetId: '',
  },
  cellDataMap = new CellDataMapImpl(),
) {
  const result = parseFormula(str, coord, cellDataMap);
  expect(result.result).toEqual(expected);
}

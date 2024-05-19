import { parseFormula, CellDataMapImpl } from '../..';

describe('R1C1.test.ts', () => {
  describe('cell', () => {
    test('R1C1', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );
      expect(parseFormula('=R1C1', cellDataMap)).toEqual({
        isError: false,
        result: 0,
        expressionStr: 'R1C1',
      });
    });
    test('R10C10', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 9, col: 9, rowCount: 1, colCount: 1, sheetId: '' },
        [[10]],
      );
      expect(parseFormula('=r10c10', cellDataMap)).toEqual({
        isError: false,
        result: 10,
        expressionStr: 'R10C10',
      });
    });
  });
});

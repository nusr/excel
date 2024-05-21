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

    test('R[-2]C[-2]', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [['test']],
      );
      cellDataMap.setCurrentCell({ row: 2, col: 2 });
      expect(parseFormula('=R[-2]C[-2]', cellDataMap)).toEqual({
        isError: false,
        result: 'test',
        expressionStr: 'R[-2]C[-2]',
      });
    });

    test('RC', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 2, col: 2, rowCount: 1, colCount: 1, sheetId: '' },
        [[10]],
      );
      cellDataMap.setCurrentCell({ row: 2, col: 2 });
      expect(parseFormula('=RC', cellDataMap)).toEqual({
        isError: false,
        result: 10,
        expressionStr: 'RC',
      });
    });
  });
});

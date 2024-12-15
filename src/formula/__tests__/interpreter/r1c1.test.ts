import { CellDataMapImpl } from '../../eval';
import { expectFormula } from './util';

describe('R1C1.test.ts', () => {
  describe('cell', () => {
    test('R1C1', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );
      expectFormula('=R1C1', [0], undefined, cellDataMap);
    });
    test('R10C10', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 9, col: 9, rowCount: 1, colCount: 1, sheetId: '' },
        [[10]],
      );
      expectFormula('=r10c10', [10], undefined, cellDataMap);
    });

    test('R10C10', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 9, col: 9, rowCount: 1, colCount: 1, sheetId: '' },
        [[10]],
      );
      expectFormula('=R10C10', [10], undefined, cellDataMap);
    });

    test('R[-2]C[-2]', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [['test']],
      );
      expectFormula(
        'R[-2]C[-2]',
        ['test'],
        { row: 2, col: 2, sheetId: '' },
        cellDataMap,
      );
    });

    test('RC', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 2, col: 2, rowCount: 1, colCount: 1, sheetId: '' },
        [[10]],
      );
      expectFormula('=RC', [10], { row: 2, col: 2, sheetId: '' }, cellDataMap);
    });
  });
});

import { CellDataMapImpl } from '../../eval';
import { expectFormula } from './util';

describe('parseFormula variable', () => {
  it('should evaluate default variables', () => {
    expectFormula('TRUE', [true]);
    expectFormula('FALSE', [false]);
  });
  it('not found', () => {
    expectFormula('foo', ['#REF!']);
  });
  it('should evaluate custom variables', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['222'],
    ]);
    cellDataMap.setDefinedName('foo', {
      row: 0,
      col: 0,
      sheetId: '',
      colCount: 1,
      rowCount: 1,
    });

    expectFormula('foo', ['222'], undefined, cellDataMap);
  });
  test('nested formula', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['1', '2', '=A1', '=B1'],
    ]);

    expectFormula('=SUM(C1,D1)', [3], undefined, cellDataMap);
  });
});

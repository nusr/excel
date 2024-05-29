import { parseFormula, CellDataMapImpl } from '../..';

describe('parseFormula variable', () => {
  it('should evaluate default variables', () => {
    expect(parseFormula('TRUE')).toEqual({
      result: true,
      isError: false,
      expressionStr: 'TRUE',
    });
    expect(parseFormula('FALSE')).toEqual({
      result: false,
      isError: false,
      expressionStr: 'FALSE',
    });
  });
  it('not found', () => {
    expect(parseFormula('foo')).toEqual({
      result: '#REF!',
      isError: true,
      expressionStr: '',
    });
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
    expect(parseFormula('foo', { row: 0, col: 0 }, cellDataMap)).toEqual({
      result: '222',
      isError: false,
      expressionStr: 'foo',
    });
  });
  test('nested formula', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['1', '2', '=A1', '=B1'],
    ]);
    expect(
      parseFormula('=SUM(C1,D1)', { row: 0, col: 0 }, cellDataMap),
    ).toEqual({
      result: 3,
      isError: false,
      expressionStr: 'SUM(C1,D1)',
    });
  });
});

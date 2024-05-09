import { parseFormula, VariableMapImpl, CellDataMapImpl } from '../..';

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
    const temp = new VariableMapImpl();
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['222'],
    ]);
    temp.set('foo', {
      row: 0,
      col: 0,
      sheetId: '',
      colCount: 1,
      rowCount: 1,
    });
    expect(parseFormula('foo', cellDataMap, temp)).toEqual({
      result: '222',
      isError: false,
      expressionStr: 'foo',
    });
  });
});

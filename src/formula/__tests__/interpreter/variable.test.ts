import { parseFormula, VariableMapImpl, CellDataMapImpl } from '../..';

describe('parseFormula variable', () => {
  it('should evaluate default variables', () => {
    expect(parseFormula('TRUE')).toEqual({
      result: true,
      error: null,
      expressionStr: 'TRUE',
    });
    expect(parseFormula('FALSE')).toEqual({
      result: false,
      error: null,
      expressionStr: 'FALSE',
    });
  });
  // it('not found', () => {
  //   expect(parseFormula("foo")).toEqual({
  //     result: null,
  //     error: "#NAME?",
  //     expressionStr: ''
  //   });
  // })
  it('should evaluate custom variables', () => {
    const temp = new VariableMapImpl();
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(0, 0, '', '222');
    temp.set('foo', {
      row: 0,
      col: 0,
      sheetId: '',
      colCount: 1,
      rowCount: 1,
    });
    expect(parseFormula('foo', cellDataMap, temp)).toEqual({
      result: '222',
      error: null,
      expressionStr: 'foo',
    });
  });
});

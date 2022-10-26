import { parseFormula, CellDataMapImpl } from '../..';

describe('parseFormula reference', () => {
  it('just cell reference', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(0, 0, '', 0);
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: 0,
    });
    expect(parseFormula('sum(A1)', cellDataMap)).toEqual({
      error: null,
      result: 0,
    });
    cellDataMap.set(0, 0, '', '22');
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: '22',
    });
    cellDataMap.set(0, 0, '', 'test');
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: 'test',
    });
    cellDataMap.set(0, 0, '', 3);
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: 3,
    });
  });
  it('cell range', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(0, 0, '', 1);
    cellDataMap.set(0, 1, '', 2);
    cellDataMap.set(0, 2, '', 3);
    expect(parseFormula('sum(A1:C1)', cellDataMap)).toEqual({
      error: null,
      result: 6,
    });
    cellDataMap.set(0, 2, '', 10);
    expect(parseFormula('sum(A1:C1)', cellDataMap)).toEqual({
      error: null,
      result: 13,
    });
  });
});

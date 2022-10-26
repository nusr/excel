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
  it('cell math', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(0, 0, '', 2);
    cellDataMap.set(0, 1, '', 3);
    expect(parseFormula('A1 * B1', cellDataMap)).toEqual({
      error: null,
      result: 6,
    });
    expect(parseFormula('A1 + B1', cellDataMap)).toEqual({
      error: null,
      result: 5,
    });
    expect(parseFormula('B1 - A1', cellDataMap)).toEqual({
      error: null,
      result: 1,
    });

    expect(parseFormula('B1 / A1', cellDataMap)).toEqual({
      error: null,
      result: 1.5,
    });
    expect(parseFormula('B1 & A1', cellDataMap)).toEqual({
      error: null,
      result: '32',
    });
    expect(parseFormula('A1 & B1 ', cellDataMap)).toEqual({
      error: null,
      result: '23',
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
  it('cell range union', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(0, 0, '', 1);
    cellDataMap.set(0, 1, '', 2);
    cellDataMap.set(0, 2, '', 3);

    cellDataMap.set(0, 3, '', 4);
    cellDataMap.set(0, 4, '', 5);
    expect(parseFormula('sum(A1:C1, D1:E1)', cellDataMap)).toEqual({
      error: null,
      result: 15,
    });
  });
});

import { parseFormula, CellDataMapImpl } from '../..';

describe('parseFormula reference', () => {
  it('just cell reference', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [0],
    ]);
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: 0,
      expressionStr: 'A1',
    });
    expect(parseFormula('sum(A1)', cellDataMap)).toEqual({
      error: null,
      result: 0,
      expressionStr: 'SUM(A1)',
    });

    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['22'],
    ]);
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: '22',
      expressionStr: 'A1',
    });
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['test'],
    ]);
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: 'test',
      expressionStr: 'A1',
    });
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [3],
    ]);
    expect(parseFormula('A1', cellDataMap)).toEqual({
      error: null,
      result: 3,
      expressionStr: 'A1',
    });
  });
  it('cell math', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [2, 3],
    ]);
    expect(parseFormula('A1 *  B1', cellDataMap)).toEqual({
      error: null,
      result: 6,
      expressionStr: 'A1*B1',
    });
    expect(parseFormula('A1 +  B1', cellDataMap)).toEqual({
      error: null,
      result: 5,
      expressionStr: 'A1+B1',
    });
    expect(parseFormula('B1 -  A1', cellDataMap)).toEqual({
      error: null,
      result: 1,
      expressionStr: 'B1-A1',
    });

    expect(parseFormula('B1 /  A1', cellDataMap)).toEqual({
      error: null,
      result: 1.5,
      expressionStr: 'B1/A1',
    });
    expect(parseFormula('B1 &  A1', cellDataMap)).toEqual({
      error: null,
      result: '32',
      expressionStr: 'B1&A1',
    });
    expect(parseFormula('A1 & B1 ', cellDataMap)).toEqual({
      error: null,
      result: '23',
      expressionStr: 'A1&B1',
    });
  });
  it('cell range', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [1, 2, 3],
    ]);
    expect(parseFormula('sum(A1:C1)', cellDataMap)).toEqual({
      error: null,
      result: 6,
      expressionStr: 'SUM(A1:C1)',
    });
  });
  it('cell range union', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [1, 2, 3, 4, 5],
    ]);
    expect(parseFormula('sum(A1:C1, D1:E1)', cellDataMap)).toEqual({
      error: null,
      result: 15,
      expressionStr: 'SUM(A1:C1,D1:E1)',
    });
  });
  it('sheet cell', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(
      { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '1' },
      [[1, 2, 3, 4, 5]],
    );
    cellDataMap.setSheetNameMap({
      Sheet1: '1',
    });
    expect(parseFormula('=Sheet1!A1', cellDataMap)).toEqual({
      error: null,
      result: 1,
      expressionStr: 'Sheet1!A1',
    });
  });
});

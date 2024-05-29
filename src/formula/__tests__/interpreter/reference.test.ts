import { parseFormula, CellDataMapImpl } from '../..';

describe('parseFormula reference', () => {
  it('just cell reference', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [0],
    ]);
    expect(parseFormula('A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 0,
      expressionStr: 'A1',
    });
    expect(parseFormula('sum(A1)', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 0,
      expressionStr: 'SUM(A1)',
    });

    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['22'],
    ]);
    expect(parseFormula('A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: '22',
      expressionStr: 'A1',
    });
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['test'],
    ]);
    expect(parseFormula('A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 'test',
      expressionStr: 'A1',
    });
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [3],
    ]);
    expect(parseFormula('A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 3,
      expressionStr: 'A1',
    });
  });
  it('cell math', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [2, 3],
    ]);
    expect(parseFormula('A1 *  B1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 6,
      expressionStr: 'A1*B1',
    });
    expect(parseFormula('A1 +  B1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 5,
      expressionStr: 'A1+B1',
    });
    expect(parseFormula('B1 -  A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 1,
      expressionStr: 'B1-A1',
    });

    expect(parseFormula('B1 /  A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: 1.5,
      expressionStr: 'B1/A1',
    });
    expect(parseFormula('B1 &  A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: '32',
      expressionStr: 'B1&A1',
    });
    expect(parseFormula('A1 & B1 ', { row: 0, col: 0 }, cellDataMap)).toEqual({
      isError: false,
      result: '23',
      expressionStr: 'A1&B1',
    });
  });
  it('cell range', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [1, 2, 3],
    ]);
    expect(parseFormula('sum(A1:C1)', { row: 0, col: 0 }, cellDataMap)).toEqual(
      {
        isError: false,
        result: 6,
        expressionStr: 'SUM(A1:C1)',
      },
    );
  });
  it('cell range union', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [1, 2, 3, 4, 5],
    ]);
    expect(
      parseFormula('sum(A1:C1, D1:E1)', { row: 0, col: 0 }, cellDataMap),
    ).toEqual({
      isError: false,
      result: 15,
      expressionStr: 'SUM(A1:C1,D1:E1)',
    });
  });

  it('sheet name not found', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set(
      { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '1' },
      [[1, 2, 3, 4, 5]],
    );
    cellDataMap.setSheetList([
      {
        sheetId: '1',
        rowCount: 200,
        colCount: 200,
        name: 'test',
        isHide: false,
        sort: 1,
      },
    ]);
    expect(parseFormula('=Sheet2!A1', { row: 0, col: 0 }, cellDataMap)).toEqual(
      {
        isError: true,
        result: '#REF!',
        expressionStr: '',
      },
    );
  });
  describe('reference', () => {
    test('relative', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );
      expect(parseFormula('A1', { row: 0, col: 0 }, cellDataMap)).toEqual({
        isError: false,
        result: 0,
        expressionStr: 'A1',
      });
    });
    test('absolute', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );
      expect(parseFormula('$A$1', { row: 0, col: 0 }, cellDataMap)).toEqual({
        isError: false,
        result: 0,
        expressionStr: '$A$1',
      });
    });
    test('mixed', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );
      expect(parseFormula('A$1', { row: 0, col: 0 }, cellDataMap)).toEqual({
        isError: false,
        result: 0,
        expressionStr: 'A$1',
      });
    });
  });
  describe('sheetId reference', () => {
    it('relative', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '1' },
        [[1, 2, 3, 4, 5]],
      );

      cellDataMap.setSheetList([
        {
          sheetId: '1',
          rowCount: 200,
          colCount: 200,
          name: 'Sheet1',
          isHide: false,
          sort: 1,
        },
      ]);
      expect(
        parseFormula('=Sheet1!A1', { row: 0, col: 0 }, cellDataMap),
      ).toEqual({
        isError: false,
        result: 1,
        expressionStr: 'Sheet1!A1',
      });
    });
    test('absolute', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '1' },
        [[1, 2, 3, 4, 5]],
      );

      cellDataMap.setSheetList([
        {
          sheetId: '1',
          rowCount: 200,
          colCount: 200,
          name: 'Sheet1',
          isHide: false,
          sort: 1,
        },
      ]);
      expect(
        parseFormula('=Sheet1!$A$1', { row: 0, col: 0 }, cellDataMap),
      ).toEqual({
        isError: false,
        result: 1,
        expressionStr: 'Sheet1!$A$1',
      });
    });
    test('mixed', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '1' },
        [[1, 2, 3, 4, 5]],
      );

      cellDataMap.setSheetList([
        {
          sheetId: '1',
          rowCount: 200,
          colCount: 200,
          name: 'Sheet1',
          isHide: false,
          sort: 1,
        },
      ]);
      expect(
        parseFormula('=Sheet1!$A1', { row: 0, col: 0 }, cellDataMap),
      ).toEqual({
        isError: false,
        result: 1,
        expressionStr: 'Sheet1!$A1',
      });
    });
    test('space', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '7' },
        [[1, 2, 3, 4, 5]],
      );

      cellDataMap.setSheetList([
        {
          sheetId: '7',
          rowCount: 200,
          colCount: 200,
          name: 'merge cell',
          isHide: false,
          sort: 1,
        },
      ]);
      expect(
        parseFormula("='merge cell'!A1", { row: 0, col: 0 }, cellDataMap),
      ).toEqual({
        isError: false,
        result: 1,
        expressionStr: "'merge cell'!A1",
      });
    });
  });
});

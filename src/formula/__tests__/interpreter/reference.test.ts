import { CellDataMapImpl } from '../..';
import { expectFormula } from './util';

describe('parseFormula reference', () => {
  it('just cell reference', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [0],
    ]);
    expectFormula('A1', [0], undefined, cellDataMap);
    expectFormula('sum(A1)', [0], undefined, cellDataMap);

    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['22'],
    ]);

    expectFormula('A1', ['22'], undefined, cellDataMap);

    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      ['test'],
    ]);

    expectFormula('A1', ['test'], undefined, cellDataMap);

    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [3],
    ]);
    expectFormula('A1', [3], undefined, cellDataMap);
    expectFormula('-A1', [-3], undefined, cellDataMap);
    expectFormula('A1%', [0.03], undefined, cellDataMap);
    expectFormula('-A1%', [-0.03], undefined, cellDataMap);
  });
  it('cell math', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [2, 3],
    ]);

    expectFormula('A1 *  B1', [6], undefined, cellDataMap);
    expectFormula('A1 +  B1', [5], undefined, cellDataMap);
    expectFormula('B1 -  A1', [1], undefined, cellDataMap);
    expectFormula('B1 /  A1', [1.5], undefined, cellDataMap);
    expectFormula('B1 & A1', ['32'], undefined, cellDataMap);
    expectFormula('A1 & B1', ['23'], undefined, cellDataMap);
  });
  it('cell range', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [1, 2, 3],
    ]);

    expectFormula('sum(A1:C1)', [6], undefined, cellDataMap);
  });
  it('cell range union', () => {
    const cellDataMap = new CellDataMapImpl();
    cellDataMap.set({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }, [
      [1, 2, 3, 4, 5],
    ]);

    expectFormula('sum(A1:C1, D1:E1)', [15], undefined, cellDataMap);
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

    expectFormula('=Sheet2!A1', ['#REF!'], undefined, cellDataMap);
  });
  describe('reference', () => {
    test('relative', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );

      expectFormula('A1', [0], undefined, cellDataMap);
    });
    test('absolute', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );

      expectFormula('$A$1', [0], undefined, cellDataMap);
    });
    test('mixed', () => {
      const cellDataMap = new CellDataMapImpl();
      cellDataMap.set(
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
        [[0]],
      );
      expectFormula('A$1', [0], undefined, cellDataMap);
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

      expectFormula('=Sheet1!A1', [1], undefined, cellDataMap);
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

      expectFormula('=Sheet1!$A$1', [1], undefined, cellDataMap);
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

      expectFormula('=Sheet1!$A1', [1], undefined, cellDataMap);
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
      expectFormula("='merge cell'!A1", [1], undefined, cellDataMap);
    });
  });
});

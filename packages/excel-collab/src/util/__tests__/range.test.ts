import { SheetRange, isCol, isRow, isSheet, containRange, iterateRange } from '../range';

describe('range.test.ts', () => {
  const mockSheetName = 'test';
  describe('isRow', () => {
    it('should get true ', () => {
      expect(isRow(new SheetRange(0, 0, 30, 0, mockSheetName))).toBeTruthy();
    });
  });
  describe('isCol', () => {
    it('should get true ', () => {
      expect(isCol(new SheetRange(0, 0, 0, 30, mockSheetName))).toBeTruthy();
    });
  });
  describe('isSheet', () => {
    it('should get true ', () => {
      expect(isSheet(new SheetRange(0, 0, 0, 0, mockSheetName))).toBeTruthy();
    });
  });
  describe('Range', () => {
    it('should get true', () => {
      expect(
        SheetRange.makeRange({
          row: 0,
          col: 0,
          rowCount: 0,
          colCount: 0,
          sheetId: mockSheetName,
        }),
      ).toBeInstanceOf(SheetRange);
    });
  });
  describe('containRange', () => {
    test('recognizes all rows/columns in full-axis spans and checks sheet identity', () => {
      const point = new SheetRange(3, 4, 1, 1, 'one');
      expect(containRange(point, new SheetRange(2, 0, 2, 0, 'one'))).toBe(true);
      expect(containRange(point, new SheetRange(0, 3, 0, 2, 'one'))).toBe(true);
      expect(containRange(point, new SheetRange(0, 0, 0, 0, 'one'))).toBe(true);
      expect(containRange(point, new SheetRange(4, 0, 1, 0, 'one'))).toBe(false);
      expect(containRange(point, new SheetRange(0, 5, 0, 1, 'one'))).toBe(false);
      expect(containRange(point, new SheetRange(0, 0, 10, 10, 'two'))).toBe(false);
      expect(
        containRange(new SheetRange(3, 4, 1, 1, ''), new SheetRange(0, 0, 10, 10, 'one')),
      ).toBe(true);
    });
    it('should be true', () => {
      expect(
        containRange(
          { row: 1, col: 1, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeTruthy();

      expect(
        containRange(
          { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeTruthy();

      expect(
        containRange(
          { row: 0, col: 1, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeTruthy();

      expect(
        containRange(
          { row: 1, col: 1, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeTruthy();
    });
    it('should be false', () => {
      expect(
        containRange(
          { row: 2, col: 1, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeFalsy();

      expect(
        containRange(
          { row: 2, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeFalsy();

      expect(
        containRange(
          { row: 3, col: 3, rowCount: 1, colCount: 1, sheetId: '' },
          {
            row: 0,
            col: 0,
            rowCount: 2,
            colCount: 2,
            sheetId: '',
          },
        ),
      ).toBeFalsy();
    });
  });
  describe('iterateRange', () => {
    test('all', () => {
      let count = 0;
      iterateRange({ row: 0, col: 0, rowCount: 0, colCount: 0, sheetId: '' }, 10, 10, () => {
        count++;
        return false;
      });
      expect(count).toEqual(100);
    });
    test('row', () => {
      let count = 0;
      iterateRange({ row: 0, col: 0, rowCount: 1, colCount: 0, sheetId: '' }, 10, 10, () => {
        count++;
        return false;
      });
      expect(count).toEqual(10);
    });
    test('col', () => {
      let count = 0;
      iterateRange({ row: 0, col: 0, rowCount: 0, colCount: 1, sheetId: '' }, 10, 10, () => {
        count++;
        return false;
      });
      expect(count).toEqual(10);
    });
    test('cell', () => {
      let count = 0;
      iterateRange({ row: 0, col: 0, rowCount: 2, colCount: 2, sheetId: '' }, 10, 10, () => {
        count++;
        return false;
      });
      expect(count).toEqual(4);
    });
    test('empty sheetInfo', () => {
      let count = 0;
      iterateRange({ row: 0, col: 0, rowCount: 0, colCount: 0, sheetId: '' }, 0, 0, () => {
        count++;
        return false;
      });
      expect(count).toEqual(0);
    });
  });
});

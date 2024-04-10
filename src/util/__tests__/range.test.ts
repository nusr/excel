import { SheetRange, isCol, isRow, isSheet, containRange } from '../range';

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
    it('should be true', () => {
      expect(
        containRange(1, 1, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeTruthy();

      expect(
        containRange(0, 0, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeTruthy();

      expect(
        containRange(0, 1, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeTruthy();

      expect(
        containRange(1, 1, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeTruthy();
    });
    it('should be false', () => {
      expect(
        containRange(2, 1, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeFalsy();

      expect(
        containRange(2, 0, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeFalsy();

      expect(
        containRange(3, 3, {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: '',
        }),
      ).toBeFalsy();
    });
  });
});

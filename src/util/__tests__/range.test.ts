import { Range, isCol, isRow, isSheet } from '../range';

describe('range.test.ts', () => {
  const mockSheetName = 'test';
  describe('isRow', () => {
    it('should get true ', () => {
      expect(isRow(new Range(0, 0, 30, 0, mockSheetName))).toBeTruthy();
    });
  });
  describe('isCol', () => {
    it('should get true ', () => {
      expect(isCol(new Range(0, 0, 0, 30, mockSheetName))).toBeTruthy();
    });
  });
  describe('isSheet', () => {
    it('should get true ', () => {
      expect(isSheet(new Range(0, 0, 0, 0, mockSheetName))).toBeTruthy();
    });
  });
  describe('Range', () => {
    it('should get true', () => {
      expect(
        Range.makeRange({
          row: 0,
          col: 0,
          rowCount: 0,
          colCount: 0,
          sheetId: mockSheetName,
        }),
      ).toBeInstanceOf(Range);
    });
  });
});

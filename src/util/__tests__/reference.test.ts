import { parseReference, parseCell } from '../reference';
import { Range } from '../range';

describe('reference.test.ts', () => {
  describe('parseReference', () => {
    it('should convert a1 to { row:0,col:0,rowCount:1,colCount: 1 } ', function () {
      expect(parseReference('a1')).toEqual(new Range(0, 0, 1, 1, ''));
    });
    it('should convert a1:b2 to { row:0,col:0,rowCount:2,colCount: 2 } ', function () {
      expect(parseReference('a1:b2')).toEqual(new Range(0, 0, 2, 2, ''));
    });
    it('should convert a1:c1', function () {
      const result = parseReference('a1:c1');
      expect(result).toEqual(new Range(0, 0, 1, 3, ''));
    });
  });
  describe('parseCell', () => {
    it('should convert a1 to { row:0,col:0,rowCount:1,colCount: 1 } ', function () {
      expect(parseCell('a1')).toEqual(new Range(0, 0, 1, 1, ''));
    });
    it('should convert c1', function () {
      expect(parseCell('c1')).toEqual(new Range(0, 2, 1, 1, ''));
    });
    it('should convert A to { row:0,col:0,rowCount:200,colCount: 0 } ', function () {
      expect(parseCell('A')).toEqual(new Range(0, 0, 200, 0, ''));
    });
    it('should convert 1 to { row:0,col:0,rowCount:0,colCount: 30 } ', function () {
      expect(parseCell('1')).toEqual(new Range(0, 0, 0, 30, ''));
    });
    it('should convert Sheet1!1 to { row:0,col:0,rowCount:0,colCount: 30, sheetId: Sheet1 } ', function () {
      expect(parseCell('Sheet1!1')).toEqual(new Range(0, 0, 0, 30, 'Sheet1'));
    });
    it('should convert Sheet1!A to { row:0,col:0,rowCount:200,colCount: 0, sheetId: Sheet1 } ', function () {
      expect(parseCell('Sheet1!A')).toEqual(new Range(0, 0, 200, 0, 'Sheet1'));
    });
    it('should convert Sheet1!A1 to { row:0,col:0,rowCount:1,colCount: 1, sheetId: Sheet1 } ', function () {
      expect(parseCell('Sheet1!A1')).toEqual(new Range(0, 0, 1, 1, 'Sheet1'));
    });
  });
});

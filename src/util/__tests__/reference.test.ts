import { parseReference, mergeRange } from '../reference';
import { Range } from '../range';

describe('reference.test.ts', () => {
  describe('parseReference', () => {
    test('invalid', () => {
      expect(parseReference(':')).toBeNull();
      expect(parseReference('A-1')).toBeNull();
      expect(parseReference('-1')).toBeNull();
    });
    it('should convert a1 to { row:0,col:0,rowCount:1,colCount: 1 } ', () => {
      expect(parseReference('a1')).toEqual(new Range(0, 0, 1, 1, ''));
    });
    it('should convert a1:b2 to { row:0,col:0,rowCount:2,colCount: 2 } ', () => {
      expect(parseReference('a1:b2')).toEqual(new Range(0, 0, 2, 2, ''));
    });
    it('should convert a1:c1', () => {
      const result = parseReference('a1:c1');
      expect(result).toEqual(new Range(0, 0, 1, 3, ''));
    });

    it('A1:C1', () => {
      expect(parseReference('A1:C1')).toEqual(new Range(0, 0, 1, 3, ''));
    });
    it('D1:E1', () => {
      expect(parseReference('D1:E1')).toEqual(new Range(0, 3, 1, 2, ''));
    });
    it('aa!D1:E1', () => {
      expect(parseReference('aa!D1:E1')).toEqual(new Range(0, 3, 1, 2, 'aa'));
    });
  });
  describe('parseCell', () => {
    it('should convert a1 to { row:0,col:0,rowCount:1,colCount: 1 } ', () => {
      expect(parseReference('a1')).toEqual(new Range(0, 0, 1, 1, ''));
    });
    it('should convert c1', () => {
      expect(parseReference('c1')).toEqual(new Range(0, 2, 1, 1, ''));
    });

    it('should convert B2', () => {
      expect(parseReference('B2')).toEqual(new Range(1, 1, 1, 1, ''));
    });
    it('should convert aa!B2', () => {
      expect(parseReference('aa!B2')).toEqual(new Range(1, 1, 1, 1, 'aa'));
    });
    it('should convert A to { row:0,col:0,rowCount:200,colCount: 0 } ', () => {
      expect(parseReference('A')).toEqual(new Range(0, 0, 200, 0, ''));
    });
    it('should convert 1 to { row:0,col:0,rowCount:0,colCount: 30 } ', () => {
      expect(parseReference('1')).toEqual(new Range(0, 0, 0, 30, ''));
    });
    it('should convert Sheet1!1 to { row:0,col:0,rowCount:0,colCount: 30, sheetId: Sheet1 } ', () => {
      expect(parseReference('Sheet1!1')).toEqual(
        new Range(0, 0, 0, 30, 'Sheet1'),
      );
    });
    it('should convert Sheet1!A to { row:0,col:0,rowCount:200,colCount: 0, sheetId: Sheet1 } ', () => {
      expect(parseReference('Sheet1!A')).toEqual(
        new Range(0, 0, 200, 0, 'Sheet1'),
      );
    });
    it('should convert Sheet1!A1 to { row:0,col:0,rowCount:1,colCount: 1, sheetId: Sheet1 } ', () => {
      expect(parseReference('Sheet1!A1')).toEqual(
        new Range(0, 0, 1, 1, 'Sheet1'),
      );
    });
  });
  describe('mergeRange', () => {
    test('not same sheetId', () => {
      expect(
        mergeRange(new Range(0, 0, 1, 1, 'a'), new Range(1, 1, 1, 1, '2')),
      ).toBeNull();
    });
    test('start.rowCount === 0 && end.rowCount !== 0', () => {
      expect(
        mergeRange(new Range(0, 0, 0, 1, ''), new Range(1, 1, 1, 1, '')),
      ).toBeNull();
    });
    test('start.rowCount !== 0 && end.rowCount === 0', () => {
      expect(
        mergeRange(new Range(0, 0, 1, 1, ''), new Range(1, 1, 0, 1, '')),
      ).toBeNull();
    });
    test('start.colCount === 0 && end.colCount !== 0', () => {
      expect(
        mergeRange(new Range(0, 0, 1, 0, ''), new Range(1, 1, 1, 1, '')),
      ).toBeNull();
    });
    test('start.colCount !== 0 && end.colCount === 0', () => {
      expect(
        mergeRange(new Range(0, 0, 1, 1, ''), new Range(1, 1, 1, 0, '')),
      ).toBeNull();
    });
    it('A1:B2', () => {
      expect(
        mergeRange(new Range(0, 0, 1, 1, ''), new Range(1, 1, 1, 1, '')),
      ).toEqual(new Range(0, 0, 2, 2, ''));
    });
    it('B:B', () => {
      expect(
        mergeRange(new Range(0, 1, 200, 0, ''), new Range(0, 1, 200, 0, '')),
      ).toEqual(new Range(0, 1, 200, 0, ''));
    });
    it('B:B2', () => {
      expect(
        mergeRange(new Range(0, 1, 200, 0, ''), new Range(1, 1, 1, 1, '')),
      ).toBeNull();
    });

    it('A1:C1', () => {
      expect(
        mergeRange(new Range(0, 0, 1, 1, ''), new Range(0, 2, 1, 1, '')),
      ).toEqual(new Range(0, 0, 1, 3, ''));
    });
  });
});

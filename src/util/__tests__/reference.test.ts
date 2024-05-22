import {
  parseReference,
  mergeRange,
  convertToReference,
  parseR1C1,
} from '../reference';
import { SheetRange } from '../range';

describe('reference.test.ts', () => {
  describe('convertToReference', () => {
    test('single relative', () => {
      expect(
        convertToReference(
          { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: 'test' },
          'relative',
        ),
      ).toEqual('test!A1');
    });
    test('single absolute', () => {
      expect(
        convertToReference(
          { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: 'test' },
          'absolute',
        ),
      ).toEqual('test!$A$1');
    });
    test('single mixed', () => {
      expect(
        convertToReference(
          { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: 'test' },
          'mixed',
        ),
      ).toEqual('test!$A1');
    });

    test('relative', () => {
      expect(
        convertToReference(
          { row: 0, col: 0, rowCount: 2, colCount: 2, sheetId: 'test' },
          'relative',
        ),
      ).toEqual('test!A1:B2');
    });
    test('absolute', () => {
      expect(
        convertToReference(
          { row: 0, col: 0, rowCount: 2, colCount: 2, sheetId: 'test' },
          'absolute',
        ),
      ).toEqual('test!$A$1:$B$2');
    });
    test('mixed', () => {
      expect(
        convertToReference(
          { row: 0, col: 0, rowCount: 2, colCount: 2, sheetId: 'test' },
          'mixed',
        ),
      ).toEqual('test!$A1:$B2');
    });
  });
  describe('parseReference', () => {
    test('invalid', () => {
      expect(parseReference(':')).toBeUndefined();
      expect(parseReference('A-1')).toBeUndefined();
      expect(parseReference('-1')).toBeUndefined();
    });
    it('should convert a1 to { row:0,col:0,rowCount:1,colCount: 1 } ', () => {
      expect(parseReference('a1')).toEqual(new SheetRange(0, 0, 1, 1, ''));
    });
    it('should convert a1:b2 to { row:0,col:0,rowCount:2,colCount: 2 } ', () => {
      expect(parseReference('a1:b2')).toEqual(new SheetRange(0, 0, 2, 2, ''));
    });
    it('should convert a1:c1', () => {
      const result = parseReference('a1:c1');
      expect(result).toEqual(new SheetRange(0, 0, 1, 3, ''));
    });

    it('A1:C1', () => {
      expect(parseReference('A1:C1')).toEqual(new SheetRange(0, 0, 1, 3, ''));
    });
    it('D1:E1', () => {
      expect(parseReference('D1:E1')).toEqual(new SheetRange(0, 3, 1, 2, ''));
    });
    it('aa!D1:E1', () => {
      expect(parseReference('aa!D1:E1')).toEqual(
        new SheetRange(0, 3, 1, 2, 'aa'),
      );
    });

    it('F:F', () => {
      expect(parseReference('F:F')).toEqual(new SheetRange(0, 5, 0, 1, ''));
    });
    it('1:1', () => {
      expect(parseReference('1:1')).toEqual(new SheetRange(0, 0, 1, 0, ''));
    });
    test("'merge cell'!A1", () => {
      expect(
        parseReference("'merge cell'!A1", (name: string) => {
          if (name === 'merge cell') {
            return '7';
          }
          return '';
        }),
      ).toEqual(new SheetRange(0, 0, 1, 1, '7'));
    });
  });
  describe('parseCell', () => {
    it('should convert a1 to { row:0,col:0,rowCount:1,colCount: 1 } ', () => {
      expect(parseReference('a1')).toEqual(new SheetRange(0, 0, 1, 1, ''));
    });
    it('should convert c1', () => {
      expect(parseReference('c1')).toEqual(new SheetRange(0, 2, 1, 1, ''));
    });

    it('should convert B2', () => {
      expect(parseReference('B2')).toEqual(new SheetRange(1, 1, 1, 1, ''));
    });
    it('should convert aa!B2', () => {
      expect(parseReference('aa!B2')).toEqual(new SheetRange(1, 1, 1, 1, 'aa'));
    });
    it('should convert A', () => {
      expect(parseReference('A')).toEqual(new SheetRange(0, 0, 0, 1, ''));
    });
    it('should convert 1', () => {
      expect(parseReference('1')).toEqual(new SheetRange(0, 0, 1, 0, ''));
    });
    it('should convert Sheet1!1', () => {
      expect(parseReference('Sheet1!1')).toEqual(
        new SheetRange(0, 0, 1, 0, 'Sheet1'),
      );
    });
    it('should convert Sheet1!A ', () => {
      expect(parseReference('Sheet1!A')).toEqual(
        new SheetRange(0, 0, 0, 1, 'Sheet1'),
      );
    });
    it('should convert Sheet1!A1', () => {
      expect(parseReference('Sheet1!A1')).toEqual(
        new SheetRange(0, 0, 1, 1, 'Sheet1'),
      );
    });
  });
  describe('mergeRange', () => {
    test('not same sheetId', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 1, 1, 'a'),
          new SheetRange(1, 1, 1, 1, '2'),
        ),
      ).toBeUndefined();
    });
    test('start.rowCount === 0 && end.rowCount !== 0', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 0, 1, ''),
          new SheetRange(1, 1, 1, 1, ''),
        ),
      ).toBeUndefined();
    });
    test('start.rowCount !== 0 && end.rowCount === 0', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 1, 1, ''),
          new SheetRange(1, 1, 0, 1, ''),
        ),
      ).toBeUndefined();
    });
    test('start.colCount === 0 && end.colCount !== 0', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 1, 0, ''),
          new SheetRange(1, 1, 1, 1, ''),
        ),
      ).toBeUndefined();
    });
    test('start.colCount !== 0 && end.colCount === 0', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 1, 1, ''),
          new SheetRange(1, 1, 1, 0, ''),
        ),
      ).toBeUndefined();
    });
    it('A1:B2', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 1, 1, ''),
          new SheetRange(1, 1, 1, 1, ''),
        ),
      ).toEqual(new SheetRange(0, 0, 2, 2, ''));
    });
    it('B:B', () => {
      expect(
        mergeRange(
          new SheetRange(0, 1, 200, 0, ''),
          new SheetRange(0, 1, 200, 0, ''),
        ),
      ).toEqual(new SheetRange(0, 1, 200, 0, ''));
    });
    it('B:B2', () => {
      expect(
        mergeRange(
          new SheetRange(0, 1, 200, 0, ''),
          new SheetRange(1, 1, 1, 1, ''),
        ),
      ).toBeUndefined();
    });

    it('A1:C1', () => {
      expect(
        mergeRange(
          new SheetRange(0, 0, 1, 1, ''),
          new SheetRange(0, 2, 1, 1, ''),
        ),
      ).toEqual(new SheetRange(0, 0, 1, 3, ''));
    });
  });
  describe('R1C1', () => {
    test('R1C1', () => {
      expect(parseR1C1('r1c1')).toEqual(new SheetRange(0, 0, 1, 1, ''));
      expect(parseR1C1('R1C1')).toEqual(new SheetRange(0, 0, 1, 1, ''));
    });
    test('R10C10', () => {
      expect(parseR1C1('R10C10')).toEqual(new SheetRange(9, 9, 1, 1, ''));
    });

    test('RC10', () => {
      expect(parseR1C1('RC10', { row: 0, col: 0 })).toEqual(
        new SheetRange(0, 9, 1, 1, ''),
      );
    });

    test('R10C', () => {
      expect(parseR1C1('R10C', { row: 0, col: 0 })).toEqual(
        new SheetRange(9, 0, 1, 1, ''),
      );
    });

    test('R[-2]C', () => {
      expect(parseR1C1('R[-2]C', { row: 10, col: 10 })).toEqual(
        new SheetRange(8, 10, 1, 1, ''),
      );
    });
    test('R[1]C10', () => {
      expect(parseR1C1('R[1]C10', { row: 0, col: 0 })).toEqual(
        new SheetRange(1, 9, 1, 1, ''),
      );
    });
    test('R[2]C[2]', () => {
      expect(parseR1C1('R[2]C[2]', { row: 0, col: 0 })).toEqual(
        new SheetRange(2, 2, 1, 1, ''),
      );
    });

    test('RC', () => {
      expect(parseR1C1('RC', { row: 0, col: 0 })).toEqual(
        new SheetRange(0, 0, 1, 1, ''),
      );
    });
  });
});

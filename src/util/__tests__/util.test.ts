import {
  getListMaxNum,
  getDefaultSheetInfo,
  splitToWords,
  convertStringToResultType,
  stringToCoordinate,
} from '../util';

describe('util.test.ts', () => {
  describe('stringToCoordinate', () => {
    test('invalid', () => {
      expect(stringToCoordinate('-10_-10')).toEqual({ row: -10, col: -10 });
      expect(stringToCoordinate('ff_test')).toEqual({ row: -1, col: -1 });
    });
    test('ok', () => {
      expect(stringToCoordinate('10_10')).toEqual({ row: 10, col: 10 });
    });
  });
  describe('convertStringToResultType', () => {
    test('string', () => {
      expect(convertStringToResultType('test')).toEqual('test');
    });
    test('number', () => {
      expect(convertStringToResultType('1')).toEqual(1);
      expect(convertStringToResultType(1)).toEqual(1);
    });
    test('boolean string', () => {
      expect(convertStringToResultType('tRue')).toEqual(true);
      expect(convertStringToResultType('False')).toEqual(false);
    });
    test('boolean', () => {
      expect(convertStringToResultType(true)).toEqual(true);
      expect(convertStringToResultType(false)).toEqual(false);
    });
  });
  describe('getListMaxNum', () => {
    it('should convert empty array to 0', () => {
      expect(getListMaxNum()).toEqual(0);
    });
    it('should convert array to 3', () => {
      expect(getListMaxNum(['1', '3', 'test2'])).toEqual(3);
    });
  });
  describe('getDefaultSheetInfo', () => {
    it('should convert empty array to 1', () => {
      expect(getDefaultSheetInfo()).toMatchObject({
        name: 'Sheet1',
        sheetId: '1',
        sort: 1,
      });
    });
    it('should convert array', () => {
      expect(
        getDefaultSheetInfo([
          {
            name: 'test',
            sheetId: '3',
            rowCount: 30,
            colCount: 20,
            isHide: false,
            sort: 0,
          },
        ]),
      ).toMatchObject({
        name: 'Sheet4',
        sheetId: '4',
        sort: 4,
      });
    });
  });
  describe('splitToWords', () => {
    test('should splitToWords', () => {
      expect(splitToWords('😊👨‍👨‍👧‍👧👦🏾')).toEqual(['😊', '👨‍👨‍👧‍👧', '👦🏾']);
    });
    test('invalid', () => {
      // @ts-ignore
      delete global.Intl.Segmenter;
      // @ts-ignore
      global.Intl.Segmenter = null;
      expect(splitToWords('😊👨‍👨‍👧‍👧👦🏾').length).toBeGreaterThan(3);
    });
  });
});

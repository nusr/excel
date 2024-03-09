import {
  getListMaxNum,
  isNumber,
  parseNumber,
  getDefaultSheetInfo,
  splitToWords,
} from '../util';

describe('util.test.ts', () => {
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
      });
    });
  });
  describe('isNumber', () => {
    it('should convert null to false', () => {
      expect(isNumber(null)).toBeFalsy();
    });
    it('should convert undefined to false', () => {
      expect(isNumber(undefined)).toBeFalsy();
    });
    it('should convert 1 to true', () => {
      expect(isNumber(1)).toBeTruthy();
    });
    it("should convert '1' to true", () => {
      expect(isNumber('1')).toBeTruthy();
    });
  });
  describe('parseNumber', () => {
    it('should convert null to 0', () => {
      expect(parseNumber(null)).toEqual(0);
    });
    it('should convert undefined to 0', () => {
      expect(parseNumber(undefined)).toEqual(0);
    });
    it('should convert 1 to 1', () => {
      expect(parseNumber(1)).toEqual(1);
    });
    it('should convert 1.23 to 1.23', () => {
      expect(parseNumber(1.23)).toEqual(1.23);
    });
    it("should convert '1' to 1", () => {
      expect(parseNumber('1')).toEqual(1);
    });
    it("should convert '1.2' to 1.2", () => {
      expect(parseNumber('1.2')).toEqual(1.2);
    });
  });
  describe('splitToWords', () => {
    it('should splitToWords', () => {
      expect(splitToWords('😊👨‍👨‍👧‍👧👦🏾')).toEqual(['😊', '👨‍👨‍👧‍👧', '👦🏾']);
    });
  });
});

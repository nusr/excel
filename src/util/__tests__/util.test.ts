import {
  getListMaxNum,
  isNumber,
  parseNumber,
  getDefaultSheetInfo,
} from '../util';

describe('util.test.ts', () => {
  describe('getListMaxNum', () => {
    it('should convert empty array to 0', function () {
      expect(getListMaxNum()).toEqual(0);
    });
    it('should convert array to 3', function () {
      expect(getListMaxNum(['1', '3', 'test2'], 'test')).toEqual(3);
    });
  });
  describe('getDefaultSheetInfo', () => {
    it('should convert empty array to 1', function () {
      expect(getDefaultSheetInfo()).toMatchObject({
        name: 'Sheet1',
        sheetId: '1',
      });
    });
    it('should convert array', function () {
      expect(
        getDefaultSheetInfo([
          {
            name: 'test',
            sheetId: '3',
            rowCount: 30,
            colCount: 20,
            activeCell: {
              row: 0,
              col: 0,
            },
          },
        ]),
      ).toMatchObject({
        name: 'Sheet1',
        sheetId: '4',
      });
    });
  });
  describe('isNumber', () => {
    it('should convert null to false', function () {
      expect(isNumber(null)).toBeFalsy();
    });
    it('should convert undefined to false', function () {
      expect(isNumber(undefined)).toBeFalsy();
    });
    it('should convert 1 to true', function () {
      expect(isNumber(1)).toBeTruthy();
    });
    it("should convert '1' to true", function () {
      expect(isNumber('1')).toBeTruthy();
    });
  });
  describe('parseNumber', () => {
    it('should convert null to 0', function () {
      expect(parseNumber(null)).toEqual(0);
    });
    it('should convert undefined to 0', function () {
      expect(parseNumber(undefined)).toEqual(0);
    });
    it('should convert 1 to 1', function () {
      expect(parseNumber(1)).toEqual(1);
    });
    it('should convert 1.23 to 1.23', function () {
      expect(parseNumber(1.23)).toEqual(1.23);
    });
    it("should convert '1' to 1", function () {
      expect(parseNumber('1')).toEqual(1);
    });
    it("should convert '1.2' to 1.2", function () {
      expect(parseNumber('1.2')).toEqual(1.2);
    });
  });
});

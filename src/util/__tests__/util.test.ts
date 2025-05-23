import {
  getListMaxNum,
  getDefaultSheetInfo,
  convertStringToResultType,
  stringToCoordinate,
  uint8ArrayToString,
  stringToUint8Array,
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
});

describe('uint8ArrayToString', () => {
  it('should convert Uint8Array to base64 string correctly', () => {
    const input = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const result = uint8ArrayToString(input);
    expect(result).toBe('SGVsbG8=');
  });

  it('should handle empty Uint8Array', () => {
    const input = new Uint8Array([]);
    const result = uint8ArrayToString(input);
    expect(result).toBe('');
  });

  it('should handle Uint8Array with special characters', () => {
    const input = new Uint8Array([240, 159, 146, 169]); // "😊"
    const result = uint8ArrayToString(input);
    expect(result).toBe('8J+SqQ==');
  });

  it('should handle Uint8Array with null bytes', () => {
    const input = new Uint8Array([0, 0, 0]);
    const result = uint8ArrayToString(input);
    expect(result).toBe('AAAA');
  });
});

describe('stringToUint8Array', () => {
  it('should convert base64 string to Uint8Array correctly', () => {
    const input = 'SGVsbG8='; // "Hello"
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
  });

  it('should handle empty string', () => {
    const input = '';
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([]));
  });

  it('should handle base64 string with special characters', () => {
    const input = '8J+SqQ=='; // "😊"
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([240, 159, 146, 169]));
  });

  it('should handle base64 string with null bytes', () => {
    const input = 'AAAA';
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([0, 0, 0]));
  });
});

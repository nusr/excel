import { numberFormat } from '..';


describe('general.test.ts', function () {
  describe('boolean', () => {
    test('ok', () => {
      expect(numberFormat(0, true)).toEqual("TRUE");
      expect(numberFormat(0, false)).toEqual("FALSE");
    })
  })
  describe('null', () => {
    test('ok', () => {
      expect(numberFormat(0, null)).toEqual("");
    })
  })
  describe('undefined', () => {
    test('ok', () => {
      expect(numberFormat(0, undefined)).toEqual("");
    })
  })
  describe('string', () => {
    test('ok', () => {
      expect(numberFormat(0, '')).toEqual("");
      expect(numberFormat(0, 'test')).toEqual("test");
    })
  })
  describe('integer', () => {
    const list = [[1, "1"],
    [10, "10"],
    [100, "100"],
    [1000, "1000"],
    [10000, "10000"],
    [100000, "100000"],
    [1000000, "1000000"],
    [10000000, "10000000"],
    [100000000, "100000000"],
    [1000000000, "1000000000"],
    // [10000000000, "10000000000"],
    // [100000000000, "1E+11"],
    // [1000000000000, "1E+12"],
    // [10000000000000, "1E+13"],
    // [100000000000000, "1E+14"],
    ]
    for (const item of list) {
      test(`actual:${item[0]}, expected:${item[1]}`, () => {
        expect(numberFormat(0, item[0])).toEqual(item[1])
      })
    }
  })
  describe.skip('Date', () => {
    it('ok', function () {
      expect(numberFormat(0, new Date(2017, 1, 19))).toEqual("2/19/17");
      expect(numberFormat(0, new Date(2017, 1, 19), { date1904: true })).toEqual("2/19/17");
      expect(numberFormat(0, new Date(1901, 0, 1))).toEqual("1/1/01");
      expect(numberFormat(0, new Date(1901, 0, 1), { date1904: true })).not.toEqual('1/1/01')
      expect(numberFormat(0, new Date(1904, 0, 1))).toEqual("1/1/04");
      expect(numberFormat(0, new Date(1904, 0, 1), { date1904: true })).toEqual("1/1/04");
    });
  })
});

import { deepEqual } from '..';

describe('deepEqual.test.ts', () => {
  describe('deepEqual', () => {
    it('should be true', () => {
      expect(deepEqual(null, null)).toBeTruthy();
      expect(deepEqual(1, 1)).toBeTruthy();
      expect(deepEqual(true, true)).toBeTruthy();
      expect(deepEqual(false, false)).toBeTruthy();
      expect(deepEqual([1, 2], [1, 2])).toBeTruthy();
      expect(deepEqual([[1, 2], [3]], [[1, 2], [3]])).toBeTruthy();
      expect(
        deepEqual(
          [{ a: { b: { c: { d: 1 } } } }],
          [{ a: { b: { c: { d: 1 } } } }],
        ),
      ).toBeTruthy();
      expect(deepEqual({ test: 1 }, { test: 1 })).toBeTruthy();
      expect(
        deepEqual(
          {
            width: 68,
            height: 19,
            top: 286,
            left: 474,
            row: 4,
            col: 6,
            style: { fontFamily: '华文仿宋' },
          },
          {
            width: 68,
            height: 19,
            top: 286,
            left: 474,
            row: 4,
            col: 6,
            style: { fontFamily: '华文仿宋' },
          },
        ),
      ).toBeTruthy();
    });
    it('should be false', () => {
      expect(deepEqual(null, false)).toBeFalsy();
      expect(deepEqual(1, false)).toBeFalsy();
      expect(deepEqual({}, { 1: 2 })).toBeFalsy();
      expect(deepEqual([1], [2])).toBeFalsy();

      expect(deepEqual([[1, 2], [2]], [[1, 2], [3]])).toBeFalsy();
      expect(
        deepEqual(
          {
            width: 68,
            height: 19,
            top: 286,
            left: 474,
            row: 4,
            col: 6,
            style: { fontFamily: '华文仿宋' },
          },
          {
            width: 68,
            height: 19,
            top: 286,
            left: 474,
            row: 4,
            col: 6,
            style: { fontFamily: '华文仿宋', isBold: true },
          },
        ),
      ).toBeFalsy();
      expect(
        deepEqual(
          {
            width: 68,
            height: 19,
            top: 286,
            left: 474,
            row: 4,
            col: 6,
            style: { fontFamily: '华文仿宋', isBold: true },
          },
          {
            width: 68,
            height: 19,
            top: 286,
            left: 474,
            row: 4,
            col: 6,
            style: { fontFamily: '华文仿宋' },
          },
        ),
      ).toBeFalsy();
    });
  });
});

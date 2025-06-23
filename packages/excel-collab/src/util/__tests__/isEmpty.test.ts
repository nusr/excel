import { isEmpty } from '..';

describe('isNil.test.ts', () => {
  describe('isNil', () => {
    it('object should get false', () => {
      expect(isEmpty({ a: { b: { c: 1 } } })).toBeFalsy();
    });

    it('{} should get true', () => {
      expect(isEmpty({})).toBeTruthy();
    });

    it('0 should get true', () => {
      expect(isEmpty(0)).toBeTruthy();
    });
    it('false should get true', () => {
      expect(isEmpty(false)).toBeTruthy();
    });
    it('empty string should get true', () => {
      expect(isEmpty('')).toBeTruthy();
    });

    it('null should get true', () => {
      expect(isEmpty(null)).toBeTruthy();
    });
    it('undefined should get true', () => {
      expect(isEmpty(undefined)).toBeTruthy();
    });
    it('void 0 should get true', () => {
      expect(isEmpty(void 0)).toBeTruthy();
    });
  });
});

import { isPlainObject } from '..';
import { runInNewContext } from 'node:vm';

function Foo() {
  return 1;
}
class Test {}

describe('isPlainObject.test.ts', () => {
  describe('isPlainObject', () => {
    it('should be true', () => {
      expect(isPlainObject({})).toBeTruthy();
      expect(isPlainObject({ 1: 2 })).toBeTruthy();
      expect(isPlainObject({ constructor: Foo })).toBeTruthy();
      expect(isPlainObject(Object.create(null))).toBeTruthy();
      expect(isPlainObject(new Object())).toBeTruthy();
      expect(isPlainObject({ test: 2 })).toBeTruthy();
      expect(isPlainObject(runInNewContext('({})'))).toBeTruthy();
    });
    it('should be false', () => {
      expect(isPlainObject([1, 'test'])).toBeFalsy();
      expect(isPlainObject(undefined)).toBeFalsy();
      expect(isPlainObject(Atomics)).toBeFalsy();
      expect(isPlainObject(ArrayBuffer)).toBeFalsy();
      expect(isPlainObject(Array)).toBeFalsy();
      expect(isPlainObject(Error)).toBeFalsy();
      expect(isPlainObject(null)).toBeFalsy();
      expect(isPlainObject(0)).toBeFalsy();
      expect(isPlainObject(1.0)).toBeFalsy();
      expect(isPlainObject(Number.NaN)).toBeFalsy();
      expect(isPlainObject(/./)).toBeFalsy();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(isPlainObject(() => {})).toBeFalsy();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(isPlainObject(() => {})).toBeFalsy();
      expect(isPlainObject(Foo)).toBeFalsy();
      expect(isPlainObject(Foo())).toBeFalsy();
      expect(isPlainObject(new Test())).toBeFalsy();
      expect(isPlainObject(false)).toBeFalsy();
      expect(isPlainObject(true)).toBeFalsy();
      expect(isPlainObject(Math)).toBeFalsy();
      (function () {
        // eslint-disable-next-line prefer-rest-params
        expect(isPlainObject(arguments)).toBeFalsy();
      })();
    });
  });
});

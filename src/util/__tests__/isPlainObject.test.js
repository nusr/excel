import { isPlainObject } from '..';
import { runInNewContext } from 'node:vm';
function Foo() {
    return 1;
}
class Test {
}
describe('isPlainObject.test.ts', () => {
    describe('isPlainObject', () => {
        it('should be true', function () {
            expect(isPlainObject({})).toBeTruthy();
            expect(isPlainObject({ 1: 2 })).toBeTruthy();
            expect(isPlainObject({ constructor: Foo })).toBeTruthy();
            expect(isPlainObject(Object.create(null))).toBeTruthy();
            expect(isPlainObject(new Object())).toBeTruthy();
            expect(isPlainObject({ test: 2 })).toBeTruthy();
            expect(isPlainObject(runInNewContext('({})'))).toBeTruthy();
        });
        it('should be false', function () {
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
            expect(isPlainObject(() => { })).toBeFalsy();
            expect(isPlainObject(function () { })).toBeFalsy();
            expect(isPlainObject(Foo)).toBeFalsy();
            expect(isPlainObject(Foo())).toBeFalsy();
            expect(isPlainObject(new Test())).toBeFalsy();
            expect(isPlainObject(false)).toBeFalsy();
            expect(isPlainObject(true)).toBeFalsy();
            expect(isPlainObject(Math)).toBeFalsy();
            (function () {
                expect(isPlainObject(arguments)).toBeFalsy();
            })();
        });
    });
});
//# sourceMappingURL=isPlainObject.test.js.map
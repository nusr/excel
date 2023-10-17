import { assert } from "../assert";
describe("assert.test.ts", () => {
    describe("assert", () => {
        it("should throw 'assert error' error", function () {
            function testFunc() {
                assert(false);
            }
            expect(testFunc).toThrowError(new Error("assert error"));
        });
        it("should throw error", function () {
            function testFunc() {
                assert(false, "test");
            }
            expect(testFunc).toThrowError(new Error("test"));
        });
        it("should not throw error", function () {
            function testFunc() {
                assert(true, "test");
            }
            expect(testFunc).not.toThrowError(new Error("test"));
        });
    });
    describe("production assert", () => {
        it("should not throw error", function () {
            function testFunc() {
                assert(true, "test", "production");
            }
            expect(testFunc).not.toThrowError(new Error("test"));
        });
    });
});
//# sourceMappingURL=assert.test.js.map
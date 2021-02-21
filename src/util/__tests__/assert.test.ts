import { assert } from "../assert";

describe("assert.test.ts", () => {
  describe("assert", () => {
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
    beforeAll(() => {
      process.env.NODE_ENV = "production";
    });
    it("should not throw error", function () {
      function testFunc() {
        assert(true, "test");
      }
      expect(testFunc).not.toThrowError(new Error("test"));
    });
  });
});

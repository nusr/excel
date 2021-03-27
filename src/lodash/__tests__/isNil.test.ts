import { isNil } from "../isNil";

describe("isNil.test.ts", () => {
  describe("isNil", () => {
    it("object should get false", function () {
      expect(isNil({ a: { b: { c: 1 } } })).toBeFalsy();
    });
    it("false should get false", function () {
      expect(isNil(false)).toBeFalsy();
    });
    it("empty string should get false", function () {
      expect(isNil("")).toBeFalsy();
    });

    it("null should get true", function () {
      expect(isNil(null)).toBeTruthy();
    });
    it("undefined should get true", function () {
      expect(isNil(undefined)).toBeTruthy();
    });
    it("void 0 should get true", function () {
      expect(isNil(void 0)).toBeTruthy();
    });
  });
});

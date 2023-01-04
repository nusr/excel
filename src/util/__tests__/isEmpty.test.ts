import { isEmpty } from "..";

describe("isNil.test.ts", () => {
  describe("isNil", () => {
    it("object should get false", function () {
      expect(isEmpty({ a: { b: { c: 1 } } })).toBeFalsy();
    });

    it("{} should get true", function () {
      expect(isEmpty({})).toBeTruthy();
    });

    it("0 should get true", function () {
      expect(isEmpty(0)).toBeTruthy();
    });
    it("false should get true", function () {
      expect(isEmpty(false)).toBeTruthy();
    });
    it("empty string should get true", function () {
      expect(isEmpty("")).toBeTruthy();
    });

    it("null should get true", function () {
      expect(isEmpty(null)).toBeTruthy();
    });
    it("undefined should get true", function () {
      expect(isEmpty(undefined)).toBeTruthy();
    });
    it("void 0 should get true", function () {
      expect(isEmpty(void 0)).toBeTruthy();
    });
  });
});

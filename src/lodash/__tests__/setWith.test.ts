import { setWith } from "../setWith";

describe("setWith.test.ts", () => {
  describe("setWith", () => {
    it("undefined should get undefined", function () {
      expect(setWith(undefined, "a", "a")).toBeUndefined();
    });
    it("null should get null", function () {
      expect(setWith(null, "a", "a")).toBeNull();
    });
    it("{} should get { a: a }", function () {
      expect(setWith({}, "a", "a")).toStrictEqual({ a: "a" });
    });
    it("{} should get { worksheets: { 1: { 2: { value: '1' } }} }", function () {
      expect(setWith({}, "worksheets.1.2.value", "1")).toStrictEqual({
        worksheets: { 1: { 2: { value: "1" } } },
      });
    });

    it("should get { worksheets: { 1: { 2: { value: '2' } }} }", function () {
      expect(
        setWith(
          { worksheets: { 1: { 2: { value: "1" } } } },
          "worksheets.1.2.value",
          "2"
        )
      ).toStrictEqual({
        worksheets: { 1: { 2: { value: "2" } } },
      });
    });
  });
});

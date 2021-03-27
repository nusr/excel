import { pick } from "../pick";

describe("pick.test.ts", () => {
  describe("pick", () => {
    it("null should get { }", function () {
      expect(pick(null, ["a"])).toEqual({});
    });

    it("undefined should get { }", function () {
      expect(pick(undefined, ["a"])).toEqual({});
    });

    it("should get { b: 2 }", function () {
      expect(pick({ a: 1, b: 2 }, ["b"])).toEqual({ b: 2 });
    });
    it("should get { a:1, b: 2 }", function () {
      expect(pick({ a: 1, b: 2 }, ["a", "b"])).toEqual({ a: 1, b: 2 });
    });
  });
});

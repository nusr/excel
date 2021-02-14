import { FormulaParser } from "../parser";
describe("classnames.test.ts", () => {
  const parser = new FormulaParser();
  describe("classnames", () => {
    it("SUM(2,3) should get 5", function () {
      const result = parser.init("SUM(2,3)");
      expect(result.result).toEqual(5);
    });
  });
});

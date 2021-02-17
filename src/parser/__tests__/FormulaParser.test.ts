import { FormulaParser } from "../parser";
describe("FormulaParser.test.ts", () => {
  const parser = new FormulaParser();
  describe("FormulaParser", () => {
    it("should convert SUM(2,3) to 5", function () {
      const result = parser.init("SUM(2,3)");
      expect(result.result).toEqual(5);
    });
  });
});

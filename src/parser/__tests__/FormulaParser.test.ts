import { formulaParser } from "..";
describe("classnames.test.ts", () => {
  describe("classnames", () => {
    it("SUM(2,3) should get 5", function () {
      const temp = formulaParser("SUM(2,3)");
      expect(temp.result).toEqual(5);
    });
  });
});

import { parseReference } from "../reference";
import { Range } from "../range";

describe("reference.test.ts", () => {
  describe("parseReference", () => {
    const mockSheetName = "test";
    it("should convert a1 to { row:0,col:0 } ", function () {
      expect(parseReference("a1", mockSheetName)).toEqual(
        new Range(0, 0, 1, 1, mockSheetName)
      );
    });
    it("should convert a1:b2 to { row:0,col:0,rowCount:2,colCount: 2 } ", function () {
      expect(parseReference("a1:b2", mockSheetName)).toEqual(
        new Range(0, 0, 2, 2, mockSheetName)
      );
    });
  });
});

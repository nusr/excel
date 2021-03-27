import { Range, isCol, isRow, isSheet } from "../range";

describe("range.test.ts", () => {
  const mockSheetName = "test";
  describe("isRow", () => {
    it("should get true ", function () {
      expect(isRow(new Range(0, 0, 0, 30, mockSheetName))).toBeTruthy();
    });
  });
  describe("isCol", () => {
    it("should get true ", function () {
      expect(isCol(new Range(0, 0, 30, 0, mockSheetName))).toBeTruthy();
    });
  });
  describe("isSheet", () => {
    it("should get true ", function () {
      expect(isSheet(new Range(0, 0, 0, 0, mockSheetName))).toBeTruthy();
    });
  });
});

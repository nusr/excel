import { getSheetNameNum, getSheetId, getDefaultSheetInfo, isNil } from "..";

describe("getSheetNameNum", () => {
  it("should convert empty array to 1", function () {
    expect(getSheetNameNum()).toEqual(1);
  });
});
describe("getSheetId", () => {
  it("should convert empty array to 1", function () {
    expect(getSheetId()).toEqual(1);
  });
});

describe("getDefaultSheetInfo", () => {
  it("should convert empty array to 1", function () {
    expect(getDefaultSheetInfo()).toMatchObject({
      name: "Sheet1",
      sheetId: "1",
    });
  });
});

describe("isNil", () => {
  it("should convert null to true", function () {
    expect(isNil(null)).toBeTruthy();
  });
  it("should convert undefined to true", function () {
    expect(isNil()).toBeTruthy();
  });
  it("should convert 1 to false", function () {
    expect(isNil(1)).toBeFalsy();
  });
});

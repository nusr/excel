import { getSheetNameNum, getSheetId, getDefaultSheetInfo } from "..";

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

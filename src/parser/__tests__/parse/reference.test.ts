import { parseFormula } from "../..";

describe("parseFormula reference", () => {
  it("just cell reference", () => {
    expect(
      parseFormula("A1", {
        currentSheetId: "test",
        queryCells: () => {
          return [];
        },
      })
    ).toEqual({
      error: null,
      result: 0,
    });
    expect(
      parseFormula("A1", {
        currentSheetId: "test",
        queryCells: () => {
          return [
            {
              value: "22",
            },
          ];
        },
      })
    ).toEqual({
      error: null,
      result: "22",
    });
    expect(
      parseFormula("A1", {
        currentSheetId: "test",
        queryCells: () => {
          return [
            {
              value: "test",
            },
          ];
        },
      })
    ).toEqual({
      error: null,
      result: "test",
    });

    expect(
      parseFormula("A1", {
        currentSheetId: "test",
        queryCells: () => {
          return [
            {
              formula: "sum(1,2)",
            },
          ];
        },
      })
    ).toEqual({
      error: null,
      result: 3,
    });
  });
  it("cell range", () => {
    expect(
      parseFormula("sum(A1:C1)", {
        currentSheetId: "test",
        queryCells: () => {
          return [
            {
              value: "1",
            },
            {
              value: "2",
            },
            {
              value: "3",
            },
          ];
        },
      })
    ).toEqual({
      error: null,
      result: 6,
    });

    expect(
      parseFormula("sum(A1:C1)", {
        currentSheetId: "test",
        queryCells: () => {
          return [
            {
              formula: "sum(1,2)",
            },
            {
              formula: "sum(3)",
            },
            {
              formula: "sum(3,4)",
            },
          ];
        },
      })
    ).toEqual({
      error: null,
      result: 13,
    });
  });
});

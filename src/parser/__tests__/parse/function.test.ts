import { parseFormula } from "../..";

describe("parseFormula function", () => {
  it("not defined function", () => {
    expect(parseFormula("foo()")).toEqual({
      error: "#NAME?",
      result: null,
    });
  });
  it("function SUM", () => {
    expect(parseFormula("SUM(1,2)")).toEqual({
      error: null,
      result: 3,
    });
    expect(parseFormula("sUM(1,2)")).toEqual({
      error: null,
      result: 3,
    });
    expect(parseFormula("suM(1,2)")).toEqual({
      error: null,
      result: 3,
    });
    expect(parseFormula("sum(1,2)")).toEqual({
      error: null,
      result: 3,
    });

    expect(parseFormula("SUM(1,SUM(2,3))")).toEqual({
      error: null,
      result: 6,
    });
  });
  it("function ABS", () => {
    expect(parseFormula("ABS()")).toEqual({
      error: "#VALUE!",
      result: null,
    });
    expect(parseFormula("ABS(1)")).toEqual({
      error: null,
      result: 1,
    });
    expect(parseFormula("ABS(-1)")).toEqual({
      error: null,
      result: 1,
    });
    expect(parseFormula('ABS("ff")')).toEqual({
      error: "#VALUE!",
      result: null,
    });
  });
});

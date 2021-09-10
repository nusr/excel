import { parseFormula } from "../..";

describe(".parseFormula() function", () => {
  it("function: SUM", () => {
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
});

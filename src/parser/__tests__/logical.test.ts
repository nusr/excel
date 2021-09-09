import { parseFormula } from "..";

describe(".parseFormula() logical", () => {
  it("operator: =", () => {
    expect(parseFormula("10 = 10")).toEqual({
      error: null,
      result: true,
    });

    expect(parseFormula("10 = 11")).toEqual({
      error: null,
      result: false,
    });
  });

  it("operator: >", () => {
    expect(parseFormula("11 > 10")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("10 > 1.1")).toEqual({
      error: null,
      result: true,
    });
    // expect(parseFormula("10 >- 10")).toEqual({
      // error: null,
      // result: true,
    // });

    expect(parseFormula("10 > 11")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10 > 11.1")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10 > 10.00001")).toEqual({
      error: null,
      result: false,
    });
  });

  it("operator: <", () => {
    expect(parseFormula("10 < 11")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("10 < 11.1")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("10 < 10.00001")).toEqual({
      error: null,
      result: true,
    });

    expect(parseFormula("11 < 10")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10 < 1.1")).toEqual({
      error: null,
      result: false,
    });
    // expect(parseFormula("10 <- 10")).toEqual({
      // error: null,
      // result: false,
    // });
  });

  it("operator: >=", () => {
    expect(parseFormula("11 >= 10")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("11 >= 11")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("10 >= 10")).toEqual({
      error: null,
      result: true,
    });
    // expect(parseFormula("10 >= -10")).toEqual({
      // error: null,
      // result: true,
    // });

    expect(parseFormula("10 >= 11")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10 >= 11.1")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10 >= 10.00001")).toEqual({
      error: null,
      result: false,
    });
  });

  it("operator: <=", () => {
    expect(parseFormula("10 <= 10")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("1.1 <= 10")).toEqual({
      error: null,
      result: true,
    });
    // expect(parseFormula("-10 <= 10")).toEqual({
      // error: null,
      // result: true,
    // });

    expect(parseFormula("11 <= 10")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("11.1 <= 10")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10.00001 <= 10")).toEqual({
      error: null,
      result: false,
    });
  });

  it("operator: <>", () => {
    expect(parseFormula("10 <> 11")).toEqual({
      error: null,
      result: true,
    });
    expect(parseFormula("1.1 <> 10")).toEqual({
      error: null,
      result: true,
    });
    // expect(parseFormula("-10 <> 10")).toEqual({
      // error: null,
      // result: true,
    // });

    expect(parseFormula("10 <> 10")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("11.1 <> 11.1")).toEqual({
      error: null,
      result: false,
    });
    expect(parseFormula("10.00001 <> 10.00001")).toEqual({
      error: null,
      result: false,
    });
  });
});

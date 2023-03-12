import { parseFormula, VariableMapImpl } from "../..";

describe("parseFormula variable", () => {
  it("should evaluate default variables", () => {
    expect(parseFormula("TRUE")).toEqual({
      result: true,
      error: null,
    });
    expect(parseFormula("FALSE")).toEqual({
      result: false,
      error: null,
    });
  });
  it("should evaluate custom variables", () => {
    expect(parseFormula("foo")).toEqual({
      result: null,
      error: "#NAME?",
    });
    const temp = new VariableMapImpl()
    temp.set("foo", "222");
    expect(parseFormula("foo", undefined, temp)).toEqual({
      result: "222",
      error: null,
    });
  });
});

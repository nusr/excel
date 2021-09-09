import { tokenize } from "../../tokenize";

export function itBlock([formula, expected, options]: any) {
  it(formula, function () {
    const result = tokenize(formula, options);

    const data = expected.map((tuple: any) => {
      const [value, type, subtype] = tuple;
      return { value, type, subtype };
    });
    expect(result).toEqual(data);
  });
}

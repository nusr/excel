import { tokenizer } from "../../tokenize";

export function itBlock([formula, expected, options]: any[]): void {
  it(formula, function () {
    const result = tokenizer(formula, options);

    const data = expected.map((tuple: any) => {
      const [value, type, subtype] = tuple;
      return { value, type, subtype };
    });
    expect(result).toEqual(data);
  });
}

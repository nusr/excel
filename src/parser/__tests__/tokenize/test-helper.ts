/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenizer } from "../../tokenize";

export function itBlock([formula, expected]: any[]): void {
  it(formula, function () {
    const result = tokenizer(formula);

    const data = expected.map((tuple: any) => {
      const [value, type, subtype] = tuple;
      return { value, type, subtype };
    });
    expect(result).toEqual(data);
  });
}

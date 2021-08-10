import { lex } from "../lex";

describe("lex.test.ts", () => {
  describe("lex", () => {
    it("lex 'sum(a1,a2)' result ", function () {
      expect(lex("sum(a1,a2)")).toEqual([
        {
          text: "sum(",
          type: "formula",
        },
        {
          text: "a1",
          type: "cell",
        },
        {
          text: ",",
          type: "comma",
        },
        {
          text: "a2",
          type: "cell",
        },
        {
          text: ")",
          type: "rightParen",
        },
      ]);
    });
  });
});

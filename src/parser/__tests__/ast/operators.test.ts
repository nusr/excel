import { generateAST as buildTree, nodeBuilder as builder } from "../../ast";
import { tokenize } from "../../tokenize";

describe("operators", function () {
  describe("precendence", function () {
    it("1 + 2 >= 3 - 4", function () {
      const tree = buildTree(tokenize("1 + 2 >= 3 - 4"));

      expect(tree).toEqual(
        builder.binaryExpression(
          ">=",
          builder.binaryExpression("+", builder.number(1), builder.number(2)),
          builder.binaryExpression("-", builder.number(3), builder.number(4))
        )
      );
    });

    it('1 + 2 & "a"', function () {
      const tree = buildTree(tokenize('1 + 2 & "a"'));

      expect(tree).toEqual(
        builder.binaryExpression(
          "&",
          builder.binaryExpression("+", builder.number(1), builder.number(2)),
          builder.text("a")
        )
      );
    });

    it("1 + 2 * 3", function () {
      const tree = buildTree(tokenize("1 + 2 * 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "+",
          builder.number(1),
          builder.binaryExpression("*", builder.number(2), builder.number(3))
        )
      );
    });

    it("1 * 2 ^ 3", function () {
      const tree = buildTree(tokenize("1 * 2 ^ 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "*",
          builder.number(1),
          builder.binaryExpression("^", builder.number(2), builder.number(3))
        )
      );
    });

    it("(1 * 2) ^ 3", function () {
      const tree = buildTree(tokenize("(1 * 2) ^ 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "^",
          builder.binaryExpression("*", builder.number(1), builder.number(2)),
          builder.number(3)
        )
      );
    });
  });

  // everything is left associative
  describe("associativity", function () {
    it("1 + 2 + 3", function () {
      const tree = buildTree(tokenize("1 + 2 + 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "+",
          builder.binaryExpression("+", builder.number(1), builder.number(2)),
          builder.number(3)
        )
      );
    });

    it("1 + (2 + 3)", function () {
      const tree = buildTree(tokenize("1 + (2 + 3)"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "+",
          builder.number(1),
          builder.binaryExpression("+", builder.number(2), builder.number(3))
        )
      );
    });

    it("1 / 2 / 3", function () {
      const tree = buildTree(tokenize("1 / 2 / 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "/",
          builder.binaryExpression("/", builder.number(1), builder.number(2)),
          builder.number(3)
        )
      );
    });
  });
});

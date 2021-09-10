import { parser as buildTree } from "../../ast";
import { tokenizer } from "../../tokenize";
import * as builder from "../../ast/node-builder";

describe("operators", function () {
  describe("precendence", function () {
    it("1 + 2 >= 3 - 4", function () {
      const tree = buildTree(tokenizer("1 + 2 >= 3 - 4"));

      expect(tree).toEqual(
        builder.binaryExpression(
          ">=",
          builder.binaryExpression(
            "+",
            builder.numberLiteral(1),
            builder.numberLiteral(2)
          ),
          builder.binaryExpression(
            "-",
            builder.numberLiteral(3),
            builder.numberLiteral(4)
          )
        )
      );
    });

    it('1 + 2 & "a"', function () {
      const tree = buildTree(tokenizer('1 + 2 & "a"'));

      expect(tree).toEqual(
        builder.binaryExpression(
          "&",
          builder.binaryExpression(
            "+",
            builder.numberLiteral(1),
            builder.numberLiteral(2)
          ),
          builder.stringLiteral("a")
        )
      );
    });

    it("1 + 2 * 3", function () {
      const tree = buildTree(tokenizer("1 + 2 * 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "+",
          builder.numberLiteral(1),
          builder.binaryExpression(
            "*",
            builder.numberLiteral(2),
            builder.numberLiteral(3)
          )
        )
      );
    });

    it("1 * 2 ^ 3", function () {
      const tree = buildTree(tokenizer("1 * 2 ^ 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "*",
          builder.numberLiteral(1),
          builder.binaryExpression(
            "^",
            builder.numberLiteral(2),
            builder.numberLiteral(3)
          )
        )
      );
    });

    it("(1 * 2) ^ 3", function () {
      const tree = buildTree(tokenizer("(1 * 2) ^ 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "^",
          builder.binaryExpression(
            "*",
            builder.numberLiteral(1),
            builder.numberLiteral(2)
          ),
          builder.numberLiteral(3)
        )
      );
    });
  });

  // everything is left associative
  describe("associativity", function () {
    it("1 + 2 + 3", function () {
      const tree = buildTree(tokenizer("1 + 2 + 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "+",
          builder.binaryExpression(
            "+",
            builder.numberLiteral(1),
            builder.numberLiteral(2)
          ),
          builder.numberLiteral(3)
        )
      );
    });

    it("1 + (2 + 3)", function () {
      const tree = buildTree(tokenizer("1 + (2 + 3)"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "+",
          builder.numberLiteral(1),
          builder.binaryExpression(
            "+",
            builder.numberLiteral(2),
            builder.numberLiteral(3)
          )
        )
      );
    });

    it("1 / 2 / 3", function () {
      const tree = buildTree(tokenizer("1 / 2 / 3"));

      expect(tree).toEqual(
        builder.binaryExpression(
          "/",
          builder.binaryExpression(
            "/",
            builder.numberLiteral(1),
            builder.numberLiteral(2)
          ),
          builder.numberLiteral(3)
        )
      );
    });
  });
});

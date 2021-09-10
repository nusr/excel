import { parser as buildTree } from "../../ast";
import { tokenizer } from "../../tokenize";
import * as builder from "../../ast/node-builder";

describe("function calls", function () {
  it("SUM()", function () {
    const tree = buildTree(tokenizer("SUM()"));

    expect(tree).toEqual(builder.functionCall("SUM"));
  });

  it("-SUM()", function () {
    const tree = buildTree(tokenizer("-SUM()"));

    expect(tree).toEqual(
      builder.unaryExpression("-", builder.functionCall("SUM"))
    );
  });

  it("SUM(1)", function () {
    const tree = buildTree(tokenizer("SUM(1)"));

    expect(tree).toEqual(builder.functionCall("SUM", builder.numberLiteral(1)));
  });

  it("SUM(1, 2)", function () {
    const tree = buildTree(tokenizer("SUM(1, 2)"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.numberLiteral(1),
        builder.numberLiteral(2)
      )
    );
  });

  it("SUM(1, SUM(2, 3))", function () {
    const tree = buildTree(tokenizer("SUM(1, SUM(2, 3))"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.numberLiteral(1),
        builder.functionCall(
          "SUM",
          builder.numberLiteral(2),
          builder.numberLiteral(3)
        )
      )
    );
  });

  it("SUM(10 / 4, SUM(2, 3))", function () {
    const tree = buildTree(tokenizer("SUM(10 / 4, SUM(2, 3))"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.binaryExpression(
          "/",
          builder.numberLiteral(10),
          builder.numberLiteral(4)
        ),
        builder.functionCall(
          "SUM",
          builder.numberLiteral(2),
          builder.numberLiteral(3)
        )
      )
    );
  });

  it("2 + SUM(1)", function () {
    const tree = buildTree(tokenizer("2 + SUM(1)"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.numberLiteral(2),
        builder.functionCall("SUM", builder.numberLiteral(1))
      )
    );
  });

  it("2 + SUM(1, 2, 3, 4)", function () {
    const tree = buildTree(tokenizer("2 + SUM(1, 2, 3, 4)"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.numberLiteral(2),
        builder.functionCall(
          "SUM",
          builder.numberLiteral(1),
          builder.numberLiteral(2),
          builder.numberLiteral(3),
          builder.numberLiteral(4)
        )
      )
    );
  });

  it("SUM(2) + SUM(1)", function () {
    const tree = buildTree(tokenizer("SUM(2) + SUM(1)"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.functionCall("SUM", builder.numberLiteral(2)),
        builder.functionCall("SUM", builder.numberLiteral(1))
      )
    );
  });

  it("SUM(SUM(1), 2 + 3)", function () {
    const tree = buildTree(tokenizer("SUM(SUM(1), 2 + 3)"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.functionCall("SUM", builder.numberLiteral(1)),
        builder.binaryExpression(
          "+",
          builder.numberLiteral(2),
          builder.numberLiteral(3)
        )
      )
    );
  });
});

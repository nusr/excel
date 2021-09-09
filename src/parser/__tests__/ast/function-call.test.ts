import { generateAST as buildTree, nodeBuilder as builder } from "../../ast";
import { tokenize } from "../../tokenize";

describe("function calls", function () {
  it("SUM()", function () {
    const tree = buildTree(tokenize("SUM()"));

    expect(tree).toEqual(builder.functionCall("SUM"));
  });

  it("-SUM()", function () {
    const tree = buildTree(tokenize("-SUM()"));

    expect(tree).toEqual(
      builder.unaryExpression("-", builder.functionCall("SUM"))
    );
  });

  it("SUM(1)", function () {
    const tree = buildTree(tokenize("SUM(1)"));

    expect(tree).toEqual(builder.functionCall("SUM", builder.number(1)));
  });

  it("SUM(1, 2)", function () {
    const tree = buildTree(tokenize("SUM(1, 2)"));

    expect(tree).toEqual(
      builder.functionCall("SUM", builder.number(1), builder.number(2))
    );
  });

  it("SUM(1, SUM(2, 3))", function () {
    const tree = buildTree(tokenize("SUM(1, SUM(2, 3))"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.number(1),
        builder.functionCall("SUM", builder.number(2), builder.number(3))
      )
    );
  });

  it("SUM(10 / 4, SUM(2, 3))", function () {
    const tree = buildTree(tokenize("SUM(10 / 4, SUM(2, 3))"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.binaryExpression("/", builder.number(10), builder.number(4)),
        builder.functionCall("SUM", builder.number(2), builder.number(3))
      )
    );
  });

  it("2 + SUM(1)", function () {
    const tree = buildTree(tokenize("2 + SUM(1)"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.number(2),
        builder.functionCall("SUM", builder.number(1))
      )
    );
  });

  it("2 + SUM(1, 2, 3, 4)", function () {
    const tree = buildTree(tokenize("2 + SUM(1, 2, 3, 4)"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.number(2),
        builder.functionCall(
          "SUM",
          builder.number(1),
          builder.number(2),
          builder.number(3),
          builder.number(4)
        )
      )
    );
  });

  it("SUM(2) + SUM(1)", function () {
    const tree = buildTree(tokenize("SUM(2) + SUM(1)"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.functionCall("SUM", builder.number(2)),
        builder.functionCall("SUM", builder.number(1))
      )
    );
  });

  it("SUM(SUM(1), 2 + 3)", function () {
    const tree = buildTree(tokenize("SUM(SUM(1), 2 + 3)"));

    expect(tree).toEqual(
      builder.functionCall(
        "SUM",
        builder.functionCall("SUM", builder.number(1)),
        builder.binaryExpression("+", builder.number(2), builder.number(3))
      )
    );
  });
});

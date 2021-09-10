import { parser as buildTree } from "../../ast";
import * as builder from "../../ast/node-builder";
import { tokenizer } from "../../tokenize";

describe("basic expressions", function () {
  it("1", function () {
    const tree = buildTree(tokenizer("1"));

    expect(tree).toEqual(builder.numberLiteral(1));
  });

  it("1E-2", function () {
    const tree = buildTree(tokenizer("1E-2"));
    expect(tree).toEqual(builder.numberLiteral(0.01));
  });

  it("10%", function () {
    const tree = buildTree(tokenizer("10%"));
    expect(tree).toEqual(builder.numberLiteral(0.1));
  });

  it("-1", function () {
    const tree = buildTree(tokenizer("-1"));
    expect(tree).toEqual(
      builder.unaryExpression("-", builder.numberLiteral(1))
    );
  });

  it("---1", function () {
    const tree = buildTree(tokenizer("---1"));

    expect(tree).toEqual(
      builder.unaryExpression(
        "-",
        builder.unaryExpression(
          "-",
          builder.unaryExpression("-", builder.numberLiteral(1))
        )
      )
    );
  });

  it('"abc"', function () {
    const tree = buildTree(tokenizer('"abc"'));

    expect(tree).toEqual(builder.stringLiteral("abc"));
  });

  it("TRUE", function () {
    const tree = buildTree(tokenizer("TRUE"));

    expect(tree).toEqual(builder.booleanLiteral(true));
  });

  it("1 + 2", function () {
    const tree = buildTree(tokenizer("1 + 2"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.numberLiteral(1),
        builder.numberLiteral(2)
      )
    );
  });

  it("-1 + 2", function () {
    const tree = buildTree(tokenizer("-1 + 2"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.unaryExpression("-", builder.numberLiteral(1)),
        builder.numberLiteral(2)
      )
    );
  });

  it('"a" & "b"', function () {
    const tree = buildTree(tokenizer('"a" & "b"'));

    expect(tree).toEqual(
      builder.binaryExpression(
        "&",
        builder.stringLiteral("a"),
        builder.stringLiteral("b")
      )
    );
  });

  it('1 <> "b"', function () {
    const tree = buildTree(tokenizer('1 <> "b"'));

    expect(tree).toEqual(
      builder.binaryExpression(
        "<>",
        builder.numberLiteral(1),
        builder.stringLiteral("b")
      )
    );
  });
});

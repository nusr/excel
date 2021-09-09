import { generateAST as buildTree, nodeBuilder as builder } from "../../ast";
import { tokenize } from "../../tokenize";

describe("basic expressions", function () {
  it("1", function () {
    const tree = buildTree(tokenize("1"));

    expect(tree).toEqual(builder.number(1));
  });

  it("1E-2", function () {
    const tree = buildTree(tokenize("1E-2"));
    expect(tree).toEqual(builder.number(0.01));
  });

  it("10%", function () {
    const tree = buildTree(tokenize("10%"));
    expect(tree).toEqual(builder.number(0.1));
  });

  it("-1", function () {
    const tree = buildTree(tokenize("-1"));
    expect(tree).toEqual(builder.unaryExpression("-", builder.number(1)));
  });

  it("---1", function () {
    const tree = buildTree(tokenize("---1"));

    expect(tree).toEqual(
      builder.unaryExpression(
        "-",
        builder.unaryExpression(
          "-",
          builder.unaryExpression("-", builder.number(1))
        )
      )
    );
  });

  it('"abc"', function () {
    const tree = buildTree(tokenize('"abc"'));

    expect(tree).toEqual(builder.text("abc"));
  });

  it("TRUE", function () {
    const tree = buildTree(tokenize("TRUE"));

    expect(tree).toEqual(builder.logical(true));
  });

  it("1 + 2", function () {
    const tree = buildTree(tokenize("1 + 2"));

    expect(tree).toEqual(
      builder.binaryExpression("+", builder.number(1), builder.number(2))
    );
  });

  it("-1 + 2", function () {
    const tree = buildTree(tokenize("-1 + 2"));

    expect(tree).toEqual(
      builder.binaryExpression(
        "+",
        builder.unaryExpression("-", builder.number(1)),
        builder.number(2)
      )
    );
  });

  it('"a" & "b"', function () {
    const tree = buildTree(tokenize('"a" & "b"'));

    expect(tree).toEqual(
      builder.binaryExpression("&", builder.text("a"), builder.text("b"))
    );
  });

  it('1 <> "b"', function () {
    const tree = buildTree(tokenize('1 <> "b"'));

    expect(tree).toEqual(
      builder.binaryExpression("<>", builder.number(1), builder.text("b"))
    );
  });
});

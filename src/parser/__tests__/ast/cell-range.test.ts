import { generateAST as buildTree, nodeBuilder as builder } from "../../ast";
import { tokenize } from "../../tokenize";

describe("cell ranges", function () {
  it("A1", function () {
    const tree = buildTree(tokenize("A1"));

    expect(tree).toEqual(builder.cell("A1", "relative"));
  });

  it("A$1", function () {
    const tree = buildTree(tokenize("A$1"));

    expect(tree).toEqual(builder.cell("A$1", "mixed"));
  });

  it("$A1", function () {
    const tree = buildTree(tokenize("$A1"));

    expect(tree).toEqual(builder.cell("$A1", "mixed"));
  });

  it("$A$1", function () {
    const tree = buildTree(tokenize("$A$1"));

    expect(tree).toEqual(builder.cell("$A$1", "absolute"));
  });

  it("A1:A4", function () {
    const tree = buildTree(tokenize("A1:A4"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("A1", "relative"),
        builder.cell("A4", "relative")
      )
    );
  });

  it("$A1:A$4", function () {
    const tree = buildTree(tokenize("$A1:A$4"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("$A1", "mixed"),
        builder.cell("A$4", "mixed")
      )
    );
  });

  it("$A$1:$A$4", function () {
    const tree = buildTree(tokenize("$A$1:$A$4"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("$A$1", "absolute"),
        builder.cell("$A$4", "absolute")
      )
    );
  });

  it("1:4", function () {
    const tree = buildTree(tokenize("1:4"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("1", "relative"),
        builder.cell("4", "relative")
      )
    );
  });

  it("$1:4", function () {
    const tree = buildTree(tokenize("$1:4"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("$1", "absolute"),
        builder.cell("4", "relative")
      )
    );
  });

  it("C:G", function () {
    const tree = buildTree(tokenize("C:G"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("C", "relative"),
        builder.cell("G", "relative")
      )
    );
  });

  it("C:$G", function () {
    const tree = buildTree(tokenize("C:$G"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("C", "relative"),
        builder.cell("$G", "absolute")
      )
    );
  });

  it("C:G5", function () {
    const tree = buildTree(tokenize("C:G5"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("C", "relative"),
        builder.cell("G5", "relative")
      )
    );
  });

  it("5:D5", function () {
    const tree = buildTree(tokenize("5:D5"));

    expect(tree).toEqual(
      builder.cellRange(
        builder.cell("5", "relative"),
        builder.cell("D5", "relative")
      )
    );
  });

  it("A1:B3,C1:D3", function () {
    const tree = buildTree(tokenize("A1:B3,C1:D3"));

    expect(tree).toEqual(
      builder.binaryExpression(
        ",",
        builder.cellRange(
          builder.cell("A1", "relative"),
          builder.cell("B3", "relative")
        ),
        builder.cellRange(
          builder.cell("C1", "relative"),
          builder.cell("D3", "relative")
        )
      )
    );
  });

  it("A1:B3 B1:D3", function () {
    const tree = buildTree(tokenize("A1:B3 B1:D3"));

    expect(tree).toEqual(
      builder.binaryExpression(
        " ",
        builder.cellRange(
          builder.cell("A1", "relative"),
          builder.cell("B3", "relative")
        ),
        builder.cellRange(
          builder.cell("B1", "relative"),
          builder.cell("D3", "relative")
        )
      )
    );
  });
});

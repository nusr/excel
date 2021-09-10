import * as nodeBuilder from "../../ast/node-builder";

describe("node builder", function () {
  it("cell", function () {
    const cell = nodeBuilder.cell("A1", "relative");
    expect(cell.type).toEqual("Cell");
    expect(cell.key).toEqual("A1");
    expect(cell.refType).toEqual("relative");
  });

  it("cellRange", function () {
    const left = nodeBuilder.cell("A1", "relative");
    const right = nodeBuilder.cell("B1", "relative");

    const cellRange = nodeBuilder.cellRange(left, right);

    expect(cellRange.type).toEqual("CellRange");
    expect(cellRange.left).toEqual(left);
    expect(cellRange.right).toEqual(right);
  });

  it("functionCall given args array", function () {
    const arg1 = nodeBuilder.numberLiteral(1);
    const arg2 = nodeBuilder.numberLiteral(2);

    const functionCall = nodeBuilder.functionCall("SUM", arg1, arg2);

    expect(functionCall.type).toEqual("CallExpression");
    expect(functionCall.name).toEqual("SUM");
    expect(functionCall.arguments).toEqual([arg1, arg2]);
  });

  it("functionCall given individual args", function () {
    const arg1 = nodeBuilder.numberLiteral(1);
    const arg2 = nodeBuilder.numberLiteral(2);

    const functionCall = nodeBuilder.functionCall("SUM", arg1, arg2);

    expect(functionCall.type).toEqual("CallExpression");
    expect(functionCall.name).toEqual("SUM");
    expect(functionCall.arguments).toEqual([arg1, arg2]);
  });

  it("functionCall given no args", function () {
    const functionCall = nodeBuilder.functionCall("SUM");

    expect(functionCall.type).toEqual("CallExpression");
    expect(functionCall.name).toEqual("SUM");
    expect(functionCall.arguments).toEqual([]);
  });

  it("number", function () {
    const number = nodeBuilder.numberLiteral(2);

    expect(number.type).toEqual("NumberLiteral");
    expect(number.value).toEqual(2);
  });

  it("text", function () {
    const text = nodeBuilder.stringLiteral("abc");

    expect(text.type).toEqual("StringLiteral");
    expect(text.value).toEqual("abc");
  });

  it("logical", function () {
    const logical = nodeBuilder.booleanLiteral(true);

    expect(logical.type).toEqual("BooleanLiteral");
    expect(logical.value).toEqual(true);
  });

  it("binary expression", function () {
    const op1 = nodeBuilder.numberLiteral(1);
    const op2 = nodeBuilder.numberLiteral(2);
    const expr = nodeBuilder.binaryExpression("+", op1, op2);

    expect(expr.type).toEqual("BinaryExpression");
    expect(expr.operator).toEqual("+");
    expect(expr.left).toEqual(op1);
    expect(expr.right).toEqual(op2);
  });

  it("unary expression", function () {
    const operand = nodeBuilder.numberLiteral(1);
    const expr = nodeBuilder.unaryExpression("-", operand);

    expect(expr.type).toEqual("UnaryExpression");
    expect(expr.operator).toEqual("-");
    expect(expr.operand).toEqual(operand);
  });
});

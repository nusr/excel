import { visit, nodeBuilder as builder } from "../../ast";

function createRecorder() {
  const callbackNames = [
    "Cell",
    "CellRange",
    "Function",
    "Number",
    "Text",
    "Logical",
    "BinaryExpression",
    "UnaryExpression",
  ];

  const calls = [];

  function attach(callbacks, name) {
    callbacks[name] = function (node) {
      calls.push([name, node]);
    };
  }

  return callbackNames.reduce(
    (all, name) => {
      attach(all, `enter${name}`);
      attach(all, `exit${name}`);
      return all;
    },
    { calls }
  ) as any;
}

describe("visiting", function () {
  it("cell node", function () {
    const recorder = createRecorder();
    const A1 = builder.cell("A1", "relative");

    visit(A1, recorder);

    expect(recorder.calls).toEqual([
      ["enterCell", A1],
      ["exitCell", A1],
    ]);
  });

  it("cell range node", function () {
    const recorder = createRecorder();
    const A1 = builder.cell("A1", "relative");
    const A2 = builder.cell("A2", "relative");
    const cellRange = builder.cellRange(A1, A2);

    visit(cellRange, recorder);

    expect(recorder.calls).toEqual([
      ["enterCellRange", cellRange],
      ["enterCell", A1],
      ["exitCell", A1],
      ["enterCell", A2],
      ["exitCell", A2],
      ["exitCellRange", cellRange],
    ]);
  });

  it("number node", function () {
    const recorder = createRecorder();
    const number = builder.number(5);

    visit(number, recorder);

    expect(recorder.calls).toEqual([
      ["enterNumber", number],
      ["exitNumber", number],
    ]);
  });

  it("text node", function () {
    const recorder = createRecorder();
    const text = builder.text("asdf");

    visit(text, recorder);

    expect(recorder.calls).toEqual([
      ["enterText", text],
      ["exitText", text],
    ]);
  });

  it("logical node", function () {
    const recorder = createRecorder();
    const logical = builder.logical(true);

    visit(logical, recorder);

    expect(recorder.calls).toEqual([
      ["enterLogical", logical],
      ["exitLogical", logical],
    ]);
  });

  it("function node", function () {
    const recorder = createRecorder();
    const number = builder.number(3);
    const text = builder.text("dogs");
    const fn = builder.functionCall("get", number, text);

    visit(fn, recorder);

    expect(recorder.calls).toEqual([
      ["enterFunction", fn],
      ["enterNumber", number],
      ["exitNumber", number],
      ["enterText", text],
      ["exitText", text],
      ["exitFunction", fn],
    ]);
  });

  it("binary expression node", function () {
    const recorder = createRecorder();
    const number = builder.number(3);
    const text = builder.text("dogs");
    const expr = builder.binaryExpression("+", number, text);

    visit(expr, recorder);

    expect(recorder.calls).toEqual([
      ["enterBinaryExpression", expr],
      ["enterNumber", number],
      ["exitNumber", number],
      ["enterText", text],
      ["exitText", text],
      ["exitBinaryExpression", expr],
    ]);
  });

  it("unary expression node", function () {
    const recorder = createRecorder();
    const number = builder.number(3);
    const expr = builder.unaryExpression("-", number);

    visit(expr, recorder);

    expect(recorder.calls).toEqual([
      ["enterUnaryExpression", expr],
      ["enterNumber", number],
      ["exitNumber", number],
      ["exitUnaryExpression", expr],
    ]);
  });
});

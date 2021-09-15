import { itBlock } from "./test-helper";

describe("arithmetic expressions", function () {
  [
    ["1", [["1", "operand", "number"]]],
    ["1.5", [["1.5", "operand", "number"]]],
    ["11.55", [["11.55", "operand", "number"]]],
    ["1E-1", [["1E-1", "operand", "number"]]],
    ["1.5E-10", [["1.5E-10", "operand", "number"]]],
    ["1.55E+100", [["1.55E+100", "operand", "number"]]],
    [
      "1 + 2",
      [
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
      ],
    ],
    [
      "1+2",
      [
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
      ],
    ],
    [
      "1.1+2.2",
      [
        ["1.1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2.2", "operand", "number"],
      ],
    ],
    [
      "(1 + 2) - 3",
      [
        ["", "sub-expression", "start"],
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
        ["", "sub-expression", "stop"],
        ["-", "operator-infix", "math"],
        ["3", "operand", "number"],
      ],
    ],
    [
      "    =     (     1.1+2  )   -       3  ",
      [
        ["", "sub-expression", "start"],
        ["1.1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
        ["", "sub-expression", "stop"],
        ["-", "operator-infix", "math"],
        ["3", "operand", "number"],
      ],
    ],
    // psalaets/excel-formula-ast#8
    [
      "=1+2*3",
      [
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
        ["*", "operator-infix", "math"],
        ["3", "operand", "number"],
      ],
    ],
    // psalaets/excel-formula-ast#8
    [
      "= 1+2*3",
      [
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
        ["*", "operator-infix", "math"],
        ["3", "operand", "number"],
      ],
    ],
    [
      "-1",
      [
        ["-", "operator-prefix", ""],
        ["1", "operand", "number"],
      ],
    ],
    ["+1", [["1", "operand", "number"]]],
    [
      "1%",
      [
        ["1", "operand", "number"],
        ["%", "operator-postfix", ""],
      ],
    ],
    [
      "-(1 + 2)",
      [
        ["-", "operator-prefix", ""],
        ["", "sub-expression", "start"],
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
        ["", "sub-expression", "stop"],
      ],
    ],
    [
      "(1 + 2)%",
      [
        ["", "sub-expression", "start"],
        ["1", "operand", "number"],
        ["+", "operator-infix", "math"],
        ["2", "operand", "number"],
        ["", "sub-expression", "stop"],
        ["%", "operator-postfix", ""],
      ],
    ],
  ].forEach(itBlock);
});

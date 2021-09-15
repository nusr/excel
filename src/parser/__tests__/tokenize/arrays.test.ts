import { itBlock } from "./test-helper";

describe("arrays", function () {
  [
    [
      "{1,2,3}",
      [
        ["ARRAY", "function", "start"],
        ["ARRAY-ROW", "function", "start"],
        ["1", "operand", "number"],
        [",", "argument", ""],
        ["2", "operand", "number"],
        [",", "argument", ""],
        ["3", "operand", "number"],
        ["", "function", "stop"],
        ["", "function", "stop"],
      ],
    ],
    [
      "{1;2;3}",
      [
        ["ARRAY", "function", "start"],
        ["ARRAY-ROW", "function", "start"],
        ["1", "operand", "number"],
        ["", "function", "stop"],
        [",", "argument", ""],
        ["ARRAY-ROW", "function", "start"],
        ["2", "operand", "number"],
        ["", "function", "stop"],
        [",", "argument", ""],
        ["ARRAY-ROW", "function", "start"],
        ["3", "operand", "number"],
        ["", "function", "stop"],
        ["", "function", "stop"],
      ],
    ],
  ].forEach(itBlock);
});

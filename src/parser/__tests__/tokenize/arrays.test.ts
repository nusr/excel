import { itBlock } from "./test-helper";

describe("arrays", function () {
  [
    [
      "{1,2,3}",
      [
        ["ARRAY", "function", "start"],
        ["ARRAYROW", "function", "start"],
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
        ["ARRAYROW", "function", "start"],
        ["1", "operand", "number"],
        ["", "function", "stop"],
        [",", "argument", ""],
        ["ARRAYROW", "function", "start"],
        ["2", "operand", "number"],
        ["", "function", "stop"],
        [",", "argument", ""],
        ["ARRAYROW", "function", "start"],
        ["3", "operand", "number"],
        ["", "function", "stop"],
        ["", "function", "stop"],
      ],
    ],
  ].forEach(itBlock);
});

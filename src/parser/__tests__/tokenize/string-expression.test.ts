import { itBlock } from "./test-helper";

describe("string expressions", function () {
  [
    ['"cat"', [["cat", "operand", "text"]]],
    [
      '"con"&"cat"',
      [
        ["con", "operand", "text"],
        ["&", "operator-infix", "concatenate"],
        ["cat", "operand", "text"],
      ],
    ],
    [
      '"con"&"cat"&"enate"',
      [
        ["con", "operand", "text"],
        ["&", "operator-infix", "concatenate"],
        ["cat", "operand", "text"],
        ["&", "operator-infix", "concatenate"],
        ["enate", "operand", "text"],
      ],
    ],
  ].forEach(itBlock);
});

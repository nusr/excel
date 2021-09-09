import { itBlock } from "./test-helper";

describe("cell ranges", function () {
  describe("A1 style", function () {
    [
      ["A1", [["A1", "operand", "range"]]],
      ["$A$1", [["$A$1", "operand", "range"]]],
      ["A$1", [["A$1", "operand", "range"]]],
      ["$A1", [["$A1", "operand", "range"]]],
      ["A10:A20", [["A10:A20", "operand", "range"]]],
      ["A1:C1", [["A1:C1", "operand", "range"]]],
      ["5:5", [["5:5", "operand", "range"]]],
      ["5:10", [["5:10", "operand", "range"]]],
      ["H:H", [["H:H", "operand", "range"]]],
      ["H:J", [["H:J", "operand", "range"]]],
      ["A10:E20", [["A10:E20", "operand", "range"]]],
    ].forEach(itBlock);
  });

  describe("R1C1 style", function () {
    [
      ["R1C1", [["R1C1", "operand", "range"]]],
      ["R[-2]C", [["R[-2]C", "operand", "range"]]],
      ["RC[3]", [["RC[3]", "operand", "range"]]],
      ["R[2]C[2]", [["R[2]C[2]", "operand", "range"]]],
      ["R[-1]", [["R[-1]", "operand", "range"]]],
      ["C[-1]", [["C[-1]", "operand", "range"]]],
      ["R", [["R", "operand", "range"]]],
      ["C", [["C", "operand", "range"]]],
    ].forEach(itBlock);
  });
});

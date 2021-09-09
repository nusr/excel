import { itBlock } from "./test-helper";

describe('range operators', function () {
  [
    ['A1:C1,A2:C2', [
      ['A1:C1', 'operand', 'range'],
      [',', 'operator-infix', 'union'],
      ['A2:C2', 'operand', 'range']
    ]],
    ['A1:C1 A2:C2', [
      ['A1:C1', 'operand', 'range'],
      [' ', 'operator-infix', 'intersect'],
      ['A2:C2', 'operand', 'range']
    ]],
    // multiple spaces between ranges
    ['A1:C1  A2:C2', [
      ['A1:C1', 'operand', 'range'],
      [' ', 'operator-infix', 'intersect'],
      ['A2:C2', 'operand', 'range']
    ]],
  ]
  .forEach(itBlock);
});

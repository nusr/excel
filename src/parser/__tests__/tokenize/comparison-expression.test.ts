import { itBlock } from "./test-helper";

describe('comparison expressions', function () {
  [
    ['1 > 2', [
      ['1', 'operand', 'number'],
      ['>', 'operator-infix', 'logical'],
      ['2', 'operand', 'number']
    ]],
    ['1 >= 2', [
      ['1', 'operand', 'number'],
      ['>=', 'operator-infix', 'logical'],
      ['2', 'operand', 'number']
    ]],
    ['1 = 2', [
      ['1', 'operand', 'number'],
      ['=', 'operator-infix', 'logical'],
      ['2', 'operand', 'number']
    ]],
    ['1 <> 2', [
      ['1', 'operand', 'number'],
      ['<>', 'operator-infix', 'logical'],
      ['2', 'operand', 'number']
    ]],
  ]
  .forEach(itBlock);
});
